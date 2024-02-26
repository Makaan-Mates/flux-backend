import mongoose from "mongoose";
const { Schema } = mongoose;

const notes = new Schema({
  title: String,
  description: String,
  videoId: String,
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bookmarked: {
    type: Boolean,
    default: false,
  },
});

const Notes = mongoose.model("Notes", notes);
export default Notes;
