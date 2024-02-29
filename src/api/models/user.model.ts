import mongoose from "mongoose";
const { Schema } = mongoose;

const user = new Schema({
  name: String,
  email: String,
  photoUrl: String,
  customOpenAIkey: String,
  history: {
    type: Schema.Types.ObjectId,
    ref: "Notes",
  },
});

const User = mongoose.model("User", user);
export default User;
