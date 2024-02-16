import { Request, Response } from "express";
import Notes from "../models/notes.model.js";
export const getFluxDetail = async (req: Request, res: Response) => {
  const videoId = req.query.videoId;
  try {
    const fluxDetail = await Notes.findOne({ videoId: videoId });
    res.status(200).json({
        message:fluxDetail
    });
  } catch (err) {
    console.log(err);
  }
};
