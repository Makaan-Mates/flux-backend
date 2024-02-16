import { Request, Response } from "express";
import Notes from "../models/notes.model.js";

export const fluxHistory = async (req: Request, res: Response) => {
  const fluxTitle = req.body.title;
  const fluxDescription = req.body.description;
  const videoId = req.body.videoId;
  try {
    const newFlux = new Notes({
      title: fluxTitle,
      description: fluxDescription,
      videoId: videoId,
    });

    await newFlux.save();

    res.status(201).json({
      message: "Flux added successfully!",
    });
  } catch (err) {
    console.log(err);
  }
};
