import { Router } from "express";
import { createNewUser } from "../controllers/user.controller";
import { requireAuth } from "@clerk/express";
import { asyncHandler } from "../libs/asyncHandler";

const router = Router();

router.post("/check-user", asyncHandler(createNewUser));

export default router;
