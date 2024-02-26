import express from "express";
const router = express.Router();
import generateSummary from "../controllers/generateSummary.js";
import { getFluxDetail } from "../controllers/getFluxDetail.js";
import {bookmarkFlux} from "../controllers/bookmarkFlux.js"
import {getUserNotes} from "../controllers/getUserNotes.js"

router.post("/createflux", generateSummary);
router.get("/getfluxdetail", getFluxDetail);
router.post("/bookmarkflux",bookmarkFlux)
router.get("/getUserNotes",getUserNotes)


export default router;
