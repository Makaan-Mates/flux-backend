import { Request, Response } from "express";
import User from "../models/user.model.js";
import Notes from "../models/notes.model.js";
export const getBookmarkStatus = async (req: Request, res: Response) => {
  try {
    const videoId = req.query.videoId;
    const email = req.query.email;

    const user = await User.findOne({ email: email });
    const userId = user?._id?.toString();
    const note = await Notes.findOne({ videoId: videoId, authorId: userId });

    res.json({
      message: note?.bookmarked,
    });
  } catch (err) {
    console.log(err);
  }
};
