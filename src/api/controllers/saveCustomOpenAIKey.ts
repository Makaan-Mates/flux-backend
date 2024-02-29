import { Request, Response } from "express";
import User from "../models/user.model.js";
import CryptoJS from "crypto-js";
import OpenAI from "openai";

export const saveCustomOpenAIKey = async (req: Request, res: Response) => {
  try {
    const secretPassphrase = process.env.SECRET_PASSPHRASE;
    if (!secretPassphrase) {
      return res.status(500).json({ message: "Encryption passphrase not set" });
    }

    const customOpenAIkey = req.body.customOpenAIkey;

    const openai = new OpenAI({
      apiKey: customOpenAIkey,
    });
    // console.log(openai);

    const encryptedOpenAIKey = CryptoJS.AES.encrypt(
      customOpenAIkey,
      secretPassphrase
    ).toString();
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.customOpenAIkey = encryptedOpenAIKey;
    await user.save();
    res.status(200).json({
      message: "Custom OPENAI_API key Updated",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
