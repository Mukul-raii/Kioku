import { Router } from "express";
import {  requireAuth } from "@clerk/express";
import { asyncHandler } from "../libs/asyncHandler";
import { new_quick_test } from "../controllers/quick-test.controller";

const router = Router();

router.post("/create",requireAuth(), asyncHandler(new_quick_test));

export default router;
