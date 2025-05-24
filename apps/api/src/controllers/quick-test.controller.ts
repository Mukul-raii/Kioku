import { Request, Response } from "express";
import { sendError, sendResponse, zodValidation } from "../libs/asyncHandler";
import { quickTestSchema } from "@repo/types";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const new_quick_test = async (
  req: Request,
  res: Response
): Promise<void> => {
    const validate = zodValidation(quickTestSchema, req.body);
    if (!validate.success) {
    console.log("error")
    sendError(res, 400, validate.error.message);
    return;
  }
  const { topic, category } = req.body;
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

    sendResponse(res, 200, "Quick Test Created Successfully", response);
    return;
  } catch (error) {
    sendResponse(res, 500, "Failed to create quick test", error);
    return;
  }
};
