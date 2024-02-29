import express from "express";
const router = express.Router();
import { createUser } from "../controllers/createUser.js";
import {saveCustomOpenAIKey} from "../controllers/saveCustomOpenAIKey.js"


router.post("/create", createUser);
router.post("/savecustomopenaikey",saveCustomOpenAIKey)

export default router;
