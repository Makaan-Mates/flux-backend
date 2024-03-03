import { Request, Response } from "express";
import User from "../models/user.model.js";
import CryptoJS from "crypto-js";
import OpenAI from "openai";

export const saveCustomOpenAIKey = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const secretPassphrase = process.env.SECRET_PASSPHRASE;
    if (!secretPassphrase) {
      res.status(500).json({ message: "Encryption passphrase not set" });
      return;
    }

    const customOpenAIkey = req.body.customOpenAIkey;
    const customGPTModel = req.body.customGPTModel;

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
      res.status(404).json({ message: "User not found" });
      return;
    }
    console.log("customGPTModel", customGPTModel);
    console.log("encryptedOpenAIKey", encryptedOpenAIKey);

    user.customOpenAIkey = encryptedOpenAIKey;
    user.customGPTModel = customGPTModel;
    await user.save();
    res.status(200).json({
      message: "Custom OPENAI_API key Updated",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCustomOpenAIKey = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.customOpenAIkey = null;
    user.customGPTModel = null;
    await user.save();

    res.status(200).json({
      message: "Custom OpenAI API key revoked successfully.",
    });
  } catch (err) {
    console.error("Failed to delete custom OpenAI API key", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
