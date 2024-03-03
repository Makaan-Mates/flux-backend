import express from "express";
const router = express.Router();
import generateSummary from "../controllers/generateSummary.js";
import { getFluxDetail } from "../controllers/getFluxDetail.js";
import { bookmarkFlux,deleteBookMarkedNote } from "../controllers/bookmarkFlux.js";
import { getUserNotes } from "../controllers/getUserNotes.js";
import { getBookmarkStatus } from "../controllers/getBookmarkStatus.js";
import { rateLimitMiddleware } from "../middlewares/rateLimitMiddleware.js";

router.post("/createflux", rateLimitMiddleware, generateSummary);
router.get("/getfluxdetail", getFluxDetail);
router.post("/bookmarkflux", bookmarkFlux);
router.delete("/deleteBookMarkedNote/:id", deleteBookMarkedNote);
router.get("/getUserNotes", getUserNotes);
router.get("/bookmarkstatus", getBookmarkStatus);

export default router;
