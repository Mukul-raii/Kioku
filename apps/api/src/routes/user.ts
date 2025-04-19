import { Router } from "express";
import { createNewUser } from "../controllers/user.controller";

const router = Router();

router.post("/check-user", createNewUser);

export default router;
