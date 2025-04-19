import { Router } from "express";
import {
  check_The_Result,
  createNewLearningLog,
  deleteLearningLog,
  generate_a_Result,
  generate_a_Test,
  getAllLearningLogs,
} from "../controllers/learningLog.controller";

const router = Router();
router.get("/get_all_learning_Log", getAllLearningLogs);
router.post("/new_learning_log", createNewLearningLog);
router.delete("/learning_log_delete", deleteLearningLog);
router.get("/get_a_test", generate_a_Test);
router.post("/check_test_result", check_The_Result);
router.post("/get_a_test_result", generate_a_Result);

export default router;
