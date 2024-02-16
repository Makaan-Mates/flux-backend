import express from "express";

const router = express.Router();
import generateSummary from "../controllers/generateSummary.js";
import { fluxHistory } from "../controllers/fluxHistory.js";

router.post("/createflux", generateSummary);
router.post("/history", fluxHistory);

export default router;
