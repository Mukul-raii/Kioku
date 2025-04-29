import { Router } from "express";
import { getAllRevision, getProgress } from "../controllers/revision.controller";
import {  requireAuth } from "@clerk/express";
import { asyncHandler } from "../libs/asyncHandler";

const router = Router();


router.post("/get_all_revision_topic", requireAuth(), asyncHandler(getAllRevision))
router.get("/getProgress", requireAuth(), asyncHandler(getProgress))

export default router;

