import { Request, Response } from "express";
import User from "../../models/user.model.js";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, photoUrl } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(200).json({
        message: "User already exists",
      });
    } else {
      const user = new User({
        name: name,
        email: email,
        photoUrl: photoUrl,
      });
      await user.save();
      return res.status(201).json({
        message: "User created successfully",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
