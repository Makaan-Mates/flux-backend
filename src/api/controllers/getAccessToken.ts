import { Request, Response } from "express";
import { config } from "dotenv";
import User from "../models/user.model.js";
config();
export const getAccessToken = async (req: Request, res: Response) => {
  try {
    const code = req.body.code;
    const clientId = process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64",
    );
    const email = req.body.email;
    console.log("email" + email);

    console.log("clientId: " + clientId);
    console.log("clientSecret: " + clientSecret);
    console.log("encoded: " + encoded);

    const exchangeAccessToken = async () => {
      if (code) {
        console.log(code);
        const response = await fetch("https://api.notion.com/v1/oauth/token", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Basic ${encoded}`,
          },
          body: JSON.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "http://localhost:5173/dashboard",
          }),
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        const user = await User.findOne({ email: email });
        if (user) {
          user.notionAccessToken = jsonResponse.access_token;
          await user.save();
        }
        res.status(200).json({
          message: jsonResponse,
        });
      }
    };
    exchangeAccessToken();
  } catch (err) {
    console.log(err);
  }
};
