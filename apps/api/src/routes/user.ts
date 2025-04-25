import { Router } from "express";
import { createNewUser } from "../controllers/user.controller";
import {  requireAuth } from "@clerk/express";

const router = Router();

router.post("/check-user",requireAuth(), createNewUser);

export default router;
