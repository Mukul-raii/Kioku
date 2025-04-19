import { Router } from "express";
import { getAllRevision } from "../controllers/revision.controller";

const router = Router();

router.post("/get_all_revision_topic", getAllRevision);

export default router;
