import { RateLimiterMongo } from "rate-limiter-flexible";
import { MongoClient } from "mongodb";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import { config } from "dotenv";
config();
// @ts-ignore
const mongoConn = new MongoClient(process.env.URL);

mongoConn.connect().then(() => {
  console.log("Connected to MongoDB for rate limiting");
});

const rateLimiter = new RateLimiterMongo({
  storeClient: mongoConn.db("videos"),
  points: 15,
  duration: 60 * 20, // 1 week
  keyPrefix: "rateLimiter", // Prefix for collection names
});

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email: email });
  if (user && user.customOpenAIkey) {
    res.set("X-RateLimit-Limit", "Unlimited");
    next();
  } else {
    try {
      const rateLimiterRes = await rateLimiter.consume(email);
      // Include rate limit info in the response headers
      res.set("X-RateLimit-Limit", rateLimiter.points.toString());
      res.set(
        "X-RateLimit-Remaining",
        rateLimiterRes.remainingPoints.toString()
      );
      res.set(
        "X-RateLimit-Reset",
        new Date(rateLimiterRes.msBeforeNext).toISOString()
      );
      next();
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "msBeforeNext" in error
      ) {
        const rejRes = error as {
          msBeforeNext: number;
          remainingPoints: number;
        };
        res
          .status(429)
          .set({
            "X-RateLimit-Limit": rateLimiter.points.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(rejRes.msBeforeNext).toISOString(),
          })
          .json({
            message:
              "Public API limit reached! Retry later or add your custom API for seamless flux.",
          });
      } else {
        // Handle unexpected error structure
        res.status(500).json({ message: "An unexpected error occurred." });
      }
    }
  }
};
