import express from "express";
const router = express.Router();
import generateSummary from "../controllers/generateSummary.js";
import { getFluxDetail } from "../controllers/getFluxDetail.js";
import {
  bookmarkFlux,
  deleteBookMarkedNote,
} from "../controllers/bookmarkFlux.js";
import { getUserNotes } from "../controllers/getUserNotes.js";
import { getBookmarkStatus } from "../controllers/getBookmarkStatus.js";
import { getAccessToken } from "../controllers/getAccessToken.js";
import { createNotionPage } from "../controllers/createNotionPage.js";
import { appendContent } from "../controllers/appendContent.js";
import { fetchNotionPages } from "../controllers/fetchNotionPages.js";
import { rateLimitMiddleware } from "../middlewares/rateLimitMiddleware.js";
import { getSharedNotes } from "../controllers/getSharedNotes.js";

router.post("/createflux", rateLimitMiddleware, generateSummary);
router.get("/getfluxdetail", getFluxDetail);
router.post("/bookmarkflux", bookmarkFlux);
router.delete("/deleteBookMarkedNote/:id", deleteBookMarkedNote);
router.get("/getUserNotes", getUserNotes);
router.get("/bookmarkstatus", getBookmarkStatus);
router.post("/accesstoken", getAccessToken);
router.post("/create/notionpage", createNotionPage);
router.post("/appendcontent", appendContent);
router.post("/fetchpages", fetchNotionPages);
router.get("/notes/shared/:noteId", getSharedNotes);
export default router;
