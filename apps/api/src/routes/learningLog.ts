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
import {  getAuth, requireAuth } from "@clerk/express";
import { asyncHandler } from "../libs/asyncHandler";

const router = Router();

router.get("/get_all_learning_Log",requireAuth(), asyncHandler(getAllLearningLogs));
router.get("/get_all_learning_Log_stats",requireAuth(), asyncHandler(getLearningLogStats));
router.post("/new_learning_log",requireAuth(), asyncHandler(createNewLearningLog));
router.put("/new_learning_log",requireAuth(), asyncHandler(createNewLearningLog));
router.delete("/learning_log_delete",requireAuth(), asyncHandler(deleteLearningLog));
router.post("/get_a_test",requireAuth(), asyncHandler(generate_a_Test));
router.post("/check_test_result",requireAuth(), asyncHandler(check_The_Result));
router.post("/get_a_test_result",requireAuth(), asyncHandler(generate_a_Result_New_Topic));
router.post("/get_a_sub_test_result",requireAuth(), asyncHandler(generate_a_Result_Sub_Topic));

export default router;
