import express from "express";
const router = express.Router();
import generateSummary from "../controllers/summary/generateSummary.js";
import { getFluxDetail } from "../controllers/flux/getFluxDetail.js";
import {
  bookmarkFlux,
  deleteBookMarkedNote,
} from "../controllers/bookmark/bookmarkFlux.js";
import { getUserNotes } from "../controllers/users/getUserNotes.js";
import { getBookmarkStatus } from "../controllers/bookmark/getBookmarkStatus.js";
import { getAccessToken } from "../controllers/notion/getAccessToken.js";
import { createNotionPage } from "../controllers/notion/createNotionPage.js";
import { appendContent } from "../controllers/notion/appendContent.js";
import { fetchNotionPages } from "../controllers/notion/fetchNotionPages.js";
import { rateLimitMiddleware } from "../middlewares/rateLimitMiddleware.js";
import { getSharedNotes } from "../controllers/flux/getSharedNotes.js";

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
