import express from "express";
const router = express.Router();
import { createUser } from "../controllers/createUser.js";
import {
  saveCustomOpenAIKey,
  deleteCustomOpenAIKey,
} from "../controllers/customOpenAIKey.js";

router.post("/create", createUser);
router.post("/savecustomopenaikey", saveCustomOpenAIKey);
router.post("/deletecustomopenaikey", deleteCustomOpenAIKey);

export default router;
