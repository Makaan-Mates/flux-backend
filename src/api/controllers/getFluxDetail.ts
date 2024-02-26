import { Request, Response } from "express";
import Notes from "../models/notes.model.js";
import User from "../models/user.model.js";
export const getFluxDetail = async (req: Request, res: Response) => {
  const videoId = req.query.videoId;
  const email = req.query.email;
  const author = await User.findOne({ email: email });
  try {
    const fluxDetail = await Notes.findOne({
      videoId: videoId,
      authorId: author?._id,
    });
    console.log("fluxDetail", fluxDetail);
    res.status(200).json({
      message: fluxDetail,
    });
  } catch (err) {
    console.log(err);
  }
};
