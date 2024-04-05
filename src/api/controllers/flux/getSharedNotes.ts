import { Request, Response } from "express";
import Notes from "../../models/notes.model.js";

export const getSharedNotes = async (req: Request, res: Response) => {
  const noteId = req.params.noteId;
  // console.log(noteId);
  const note = await Notes.findOne({ _id: noteId });
  if (note) {
    res.json({ message: note });
  } else {
    res.status(404).json({ message: "Note not found" });
  }
};
