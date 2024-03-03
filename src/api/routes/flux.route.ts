import express from "express";
const router = express.Router();
import generateSummary from "../controllers/generateSummary.js";
import { getFluxDetail } from "../controllers/getFluxDetail.js";
import { bookmarkFlux } from "../controllers/bookmarkFlux.js";
import { getUserNotes } from "../controllers/getUserNotes.js";
import { getBookmarkStatus } from "../controllers/getBookmarkStatus.js";
import { getAccessToken } from "../controllers/getAccessToken.js";
import { createNotionPage } from "../controllers/createNotionPage.js";
import { appendContent } from "../controllers/appendContent.js";
import { fetchNotionPages } from "../controllers/fetchNotionPages.js";
import { submitNotionPageId } from "../controllers/submitNotionPageId.js";
router.post("/createflux", generateSummary);
router.get("/getfluxdetail", getFluxDetail);
router.post("/bookmarkflux", bookmarkFlux);
router.get("/getUserNotes", getUserNotes);
router.get("/bookmarkstatus", getBookmarkStatus);
router.post("/accesstoken", getAccessToken);
router.post("/create/notionpage", createNotionPage);
router.post("/appendcontent", appendContent);
router.post("/fetchpages", fetchNotionPages);
router.post("/submitpageid", submitNotionPageId);
export default router;
