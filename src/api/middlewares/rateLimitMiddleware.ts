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
  storeClient: mongoConn.db("users"),
  points: 3,
  duration: 60 * 10, // 1 week
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
    next();
  } else {
    try {
      await rateLimiter.consume(email);
      next();
    } catch (rejRes) {
      res
        .status(429)
        .json({
          message:
            "Public API limit reached! Retry later or add your custom API for seamless flux.",
        });
    }
  }
};
