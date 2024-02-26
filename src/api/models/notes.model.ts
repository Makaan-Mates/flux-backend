import mongoose from "mongoose";
const { Schema } = mongoose;

const notes = new Schema({
  description: String,
  videoId: String,
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Notes = mongoose.model("Notes", notes);
export default Notes;
