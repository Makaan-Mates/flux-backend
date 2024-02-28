import {Request,Response} from "express"
import Notes from "../models/notes.model.js"

export const deleteBookMarkedNote = async (req:Request,res:Response)=>{
    const noteId = req.params.id;

    try{
       const note = await Notes.findById(noteId);

       if(!note){
              res.status(404).json({
                message:"Note not found"
              })
       }else{
        note.bookmarked = false;
        await note.save();
        res.status(200).json({
            message:"Bookmark deleted successfully"
        })
    }
    }catch(err){
        console.log(err)
    }
}