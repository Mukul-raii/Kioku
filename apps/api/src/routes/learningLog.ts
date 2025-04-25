import { Router } from "express";
import {
  check_The_Result,
  createNewLearningLog,
  deleteLearningLog,
  generate_a_Result_New_Topic,
  generate_a_Result_Sub_Topic,
  generate_a_Test,
  getAllLearningLogs,
  getLearningLogStats,
} from "../controllers/learningLog.controller";
import {  requireAuth } from "@clerk/express";

const router = Router();
router.get("/get_all_learning_Log",requireAuth(), getAllLearningLogs);
router.get("/get_all_learning_Log_stats",requireAuth(), getLearningLogStats);
router.post("/new_learning_log",requireAuth(), createNewLearningLog);
router.put("/new_learning_log",requireAuth(), createNewLearningLog);
router.delete("/learning_log_delete",requireAuth(), deleteLearningLog);
router.post("/get_a_test",requireAuth(), generate_a_Test);
router.post("/check_test_result",requireAuth(), check_The_Result);
router.post("/get_a_test_result",requireAuth(), generate_a_Result_New_Topic);
router.post("/get_a_sub_test_result",requireAuth(), generate_a_Result_Sub_Topic);

export default router;
