import { Request, Response } from "express";
import { config } from "dotenv";
config();
export const getAccessToken = async (req: Request, res: Response) => {
  try {
    const code = req.body.code;
    const clientId = process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );
    // Determine the redirect URI based on the environment
    const redirectUri =
      process.env.NODE_ENV === "production"
        ? process.env.REDIRECT_URI_PROD
        : process.env.REDIRECT_URI_DEV;

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
            redirect_uri: redirectUri,
          }),
        });
        const jsonResponse = await response.json();
        // console.log("jsonResponse",jsonResponse);

        res.status(200).json({
          message: jsonResponse,
        });
      }
    };
    exchangeAccessToken();
  } catch (err) {
    console.log("getaccessToken", err);
  }
};
