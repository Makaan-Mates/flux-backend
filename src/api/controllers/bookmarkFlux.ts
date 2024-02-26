import { Request, Response } from "express";
import User from "../models/user.model.js";
import Notes from "../models/notes.model.js";

export const bookmarkFlux = async (req: Request, res: Response) => {
  try {
    const videoId = req.body.videoId;
    const email = req.body.email;

    const user = await User.findOne({ email: email });
    const userId = user?._id?.toString();

    const note = await Notes.findOne({
      videoId: videoId,
      authorId: userId,
    });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    note.bookmarked = !note.bookmarked;
    await note.save();
    res.status(200).json({
      message: note.bookmarked,
    });
  } catch (err) {
    console.error("Failed to toggle bookmark status", err);
    res.status(500).json({ message: "Failed to toggle bookmark status" });
  }
};
