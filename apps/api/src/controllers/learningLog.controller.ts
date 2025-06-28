import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generate_test_model, resultGenerateModel } from "../libs/genai";
import redis from "../libs/redis";
import { zodValidation, sendResponse, sendError } from "../libs/asyncHandler";
import { newNoteSchema } from "@repo/types";
import { LearningLogTestService } from "../service/test.service";
const prisma = new PrismaClient();

export const createNewLearningLog = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("userid chechking ", req.auth);
  const userId = req.auth.userId;
  const { notes, topic, category } = req.body;

  if (!userId) {
    sendError(res, 401, "Unauthorized - User ID not found");
    return;
  }
  const validate = zodValidation(newNoteSchema, req.body);

  if (!validate.success) {
    sendError(res, 400, "Validation failed", validate.error?.errors);
    return;
  }
  console.log(userId);
  const newLearningLog = await prisma.learningNote.create({
    data: {
      userId: userId,
      topic,
      notes,
      category,
    },
  });
  console.log(newLearningLog);
  res.status(200).json({
    message: "Learning Log created successfully",
    newLearningLog,
  });
};

//To get the learning logs For MY notes page
export const getLearningLogStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.auth.userId;

  if (!userId) {
    sendError(res, 401, "Unauthorized - User ID not found");
    return;
  }

  try {
    const cachedLearningLogs = await redis.get(`learningLogs:${userId}`);
    const cachedLearningLogsStats = await redis.get(
      `learningLogsStats:${userId}`
    );

    if (cachedLearningLogs && cachedLearningLogsStats) {
      sendResponse(res, 200, "Learning Logs Fetched Successfully", {
        learningLogs: JSON.parse(cachedLearningLogs),
        learningLogsWithStats: JSON.parse(cachedLearningLogsStats),
      });
      return;
    }

    const learningLogs = await prisma.learningNote.findMany({
      where: { userId },
      include: {
        review: {
          include: {
            testResult: {
              orderBy: {
                lastReviewed: "desc",
              },
            },
          },
        },
      },
    });

    const learningLogsWithStats = learningLogs.map((learningLog) => {
      const testResult = learningLog.review?.[0]?.testResult || [];

      const lastScore = testResult.reduce(
        (sum, result) => sum + result.lastScore,
        0
      );
      const totalSubTopic = testResult.length;
      const avgScore = lastScore / totalSubTopic;
      const retention = (avgScore / 5) * 100;
      return {
        ...learningLog,
        totalSubTopic: totalSubTopic,
        retention: retention,
      };
    });

    await redis.set(
      `learningLogsStats:${userId}`,
      JSON.stringify(learningLogsWithStats),
      "EX",
      60 * 60
    );
    await redis.set(
      `learningLogs:${userId}`,
      JSON.stringify(learningLogs),
      "EX",
      60 * 60
    );

    sendResponse(res, 200, "Learning Logs Fetched Successfully", {
      learningLogs,
      learningLogsWithStats,
    });
  } catch (error) {
    sendError(res, 500, "Failed to fetch learning logs", error);
  }
};

export const updateLearningLog = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { logId } = req.params;
  const { notes, topic, category } = req.body;
  const userId = req.auth.userId;

  if (!userId) {
    sendError(res, 401, "Unauthorized - User ID not found");
    return;
  }

  if (!logId) {
    sendError(res, 400, "Learning log ID is required");
    return;
  }

  try {
    const updatedLog = await prisma.learningNote.update({
      where: {
        id: parseInt(logId),
        userId, // Ensure user can only update their own logs
      },
      data: {
        category,
        topic,
        notes,
      },
    });

    sendResponse(res, 200, "Successfully updated", updatedLog);
  } catch (error) {
    sendError(res, 500, "Failed to update learning log", error);
  }
};

export const getAllLearningLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.auth.userId;

  if (!userId) {
    sendError(res, 401, "Unauthorized - User ID not found");
    return;
  }

  try {
    const cachedLearningLogs = await redis.get(`learningLogs:${userId}`);
    if (cachedLearningLogs) {
      sendResponse(res, 200, "Learning Logs Fetched Successfully", {
        learningLogs: JSON.parse(cachedLearningLogs),
      });
      return;
    }

    const learningLogs = await prisma.learningNote.findMany({
      where: { userId },
    });

    // Cache the results for future requests
    await redis.set(
      `learningLogs:${userId}`,
      JSON.stringify(learningLogs),
      "EX",
      60 * 60
    );

    sendResponse(res, 200, "Learning Logs Fetched Successfully", {
      learningLogs,
    });
  } catch (error) {
    sendError(res, 500, "Failed to fetch learning logs", error);
  }
};

export const deleteLearningLog = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = req.auth.userId;

  if (!userId) {
    sendError(res, 401, "Unauthorized - User ID not found");
    return;
  }

  if (!id) {
    sendError(res, 400, "Learning log ID is required");
    return;
  }

  try {
    const learningLog = await prisma.learningNote.delete({
      where: {
        id: parseInt(id),
        userId, // Ensure user can only delete their own logs
      },
    });

    // Clear cache for this user
    await redis.del(`learningLogs:${userId}`, `learningLogsStats:${userId}`);

    sendResponse(res, 200, "Learning Log Deleted Successfully", learningLog);
  } catch (error) {
    sendError(res, 500, "Failed to delete learning log", error);
  }
};

export const generate_a_Test = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("generate a test", req.params);
  const userId = req.auth.userId;
  const { id, isSubTopic } = req.params;
  const { mode, difficulty }: { mode: string; difficulty: string } = req.body;
  console.log(userId, id, isSubTopic);

  if (!userId) {
    sendError(res, 401, "Unauthorized - User ID not found");
    return;
  }

  if (!id) {
    sendError(res, 400, "Learning log ID is required");
    return;
  }

  try {
    const get_a_new_test = await LearningLogTestService.generateTest({
      learningLogId: parseInt(id),
      subTopicId: isSubTopic === "1" ? parseInt(id) : undefined,
      mode: mode,
      userId,
      difficulty: difficulty,
    });

    sendResponse(res, 200, "Test Generated Successfully", { get_a_new_test });
  } catch (error) {
    sendError(res, 500, "Failed to generate test", error);
  }
};

export const check_The_Result = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { question, correctAnswer, userAnswer } = req.body;
  const userId = req.auth.userId;
  
  if (!userId) {
    sendError(res, 401, "Unauthorized - User ID not found");
    return;
  }

  if (!question || !correctAnswer || !userAnswer) {
    sendError(
      res,
      400,
      "Question, correct answer, and user answer are required"
    );
    return;
  }

  try {
    const testAnswer = await resultGenerateModel(
      `"Question: "${question}+",Correct Answer :"+${correctAnswer}+" User Answer To Check: " +${userAnswer}`
    );
    console.log("correct test answer ",testAnswer);
    
    sendResponse(res, 200, "Check Generated Successfully", {
      test: testAnswer,
    });
  } catch (error) {
    sendError(res, 500, "Failed to check answer", error);
  }
};

export const generate_a_Result_New_Topic = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, result } = req.body; //learning log id

  /* 
  const reviewGenerate = await prisma.review.create({
    data: {
      logId: id,
      testResult: {
        create: resa.map((r: any) => ({
          miniTopic: r.subTopic,
          lastScore: r.rating / r.totalNumber,
          currentInterval: 1, // interval is days until next review
          RepetitionCount: r.rating / r.totalNumber >= 3 ? 1 : 0, // repetition count is how many successful reviews you had
          nextReviewDate: new Date(
            new Date().setDate(new Date().getDate() + 1)
          ),
        },
    ))}; */
};

export const generate_a_Result_Sub_Topic = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, result } = req.body;
  const userId = req.auth.userId;

  if (!userId) {
    sendError(res, 401, "Unauthorized - User ID not found");
    return;
  }

  if (!id || !result) {
    sendError(res, 400, "Test result ID and result data are required");
    return;
  }

  try {
    /*     const reviewGenerate = await prisma.testResults.update({
      where: {
        id: id,
      },
      data: {
        lastScore: ratingAvg,
        EF: EF,
        currentInterval: interval,
        RepetitionCount:
          (previoustest?.RepetitionCount || 0) + (ratingAvg >= 3 ? 1 : 0),
        nextReviewDate: new Date(
          new Date().setDate(new Date().getDate() + interval)
        ),
      },
    });
 */
    sendResponse(res, 200, "Result Generated Successfully");
  } catch (error) {
    sendError(res, 500, "Failed to generate sub-topic result", error);
  }
};

export const generate_a_quick_test = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.auth.userId;

  if (!userId) {
    sendError(res, 401, "Unauthorized - User ID not found");
    return;
  }

  try {
  } catch (error) {
    sendError(res, 500, "Failed to generate quick test", error);
  }
};
