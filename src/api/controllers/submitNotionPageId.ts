import { Request, Response } from "express";
import User from "../models/user.model.js";

export const submitNotionPageId = async (req: Request, res: Response) => {
  const pageId = req.body.page_id;
  const email = req.body.email;


  const user = await User.findOne({ email: email });
  if (!user) return res.status(404).json({ error: "User not found." });

  //@ts-ignore
  user.notionPageId = pageId;
  await user.save();

  res.status(200).json({
    message: "Successfully updated Notion Page ID.",
  });
};
