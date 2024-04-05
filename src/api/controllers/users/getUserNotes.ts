import { Request, Response } from "express";
import Notes from "../../models/notes.model.js";
import User from "../../models/user.model.js";
export const getUserNotes = async (req: Request, res: Response) => {
  const email = req.query.email;
  const author = await User.findOne({ email: email });
  try {
    const userNotes = await Notes.find({
      authorId: author?._id,
    });
    res.status(200).json({
      message: userNotes,
    });
  } catch (err) {
    console.log(err);
  }
};
