import express from "express";

const router = express.Router();
import generateSummary from "../controllers/generateSummary.js";
import { getFluxDetail } from "../controllers/getFluxDetail.js";
router.post("/createflux", generateSummary);
router.get("/getfluxdetail", getFluxDetail);
// router.post("/bookmark", bookmarkFlux);

export default router;
