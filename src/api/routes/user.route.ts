import express from "express";
import { createUser } from "../controllers/createUser.js";
const router = express.Router();

router.post("/create", createUser);

export default router;
