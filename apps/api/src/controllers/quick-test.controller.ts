import { Request, Response } from "express";
import { sendError, sendResponse, zodValidation } from "../libs/asyncHandler";
import { quickTestSchema } from "@repo/types";
import { PrismaClient } from "@prisma/client";
import { QuickTestGenerationService } from "../service/test.service";
const prisma = new PrismaClient();

export const new_quick_test = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validate = zodValidation(quickTestSchema, req.body);
  if (!validate.success) {
    console.log("error");
    sendError(res, 400, validate.error.message);
    return;
  }
  const { topic, category, mode } = req.body;
  const userId = req.auth.userId;

  if (!userId) {
    sendResponse(res, 401, "Unauthorized - User ID not found");
    return;
  }

  try {
    const response = await prisma.quickQuiz.create({
      data: {
        userId,
        topic,
        category,
        scheduledDate: new Date(),
      },
    });

    if (!response) {
      sendResponse(res, 500, "Failed to create quick test");
      return;
    }
    const get_a_new_test = await QuickTestGenerationService.BuildBasicQuickTest(
      {
        topic,
        category,
        mode,
        userId,
        difficulty: "HARD",
      }
    );

    sendResponse(res, 200, "Quick Test Created Successfully", get_a_new_test);
    return;
  } catch (error) {
    sendResponse(res, 500, "Failed to create quick test", error);
    return;
  }
};

/* export const generate_quick_test= async (params:type) {

   
} */
