import { Router } from "express";
import { getAllRevision, getProgress } from "../controllers/revision.controller";
import {  requireAuth } from "@clerk/express";

const router = Router();


router.post("/get_all_revision_topic", requireAuth(), getAllRevision);
router.get("/getProgress", requireAuth(), getProgress);

export default router;

