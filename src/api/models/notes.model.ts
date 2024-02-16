import mongoose from "mongoose";
const { Schema } = mongoose;

const notes = new Schema({
  title: String,
  description: String,
  videoId: String,
});

const Notes = mongoose.model("Notes", notes);
export default Notes;
