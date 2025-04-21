import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const getAllRevision = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({
      message: "User Id is required",
    });
    return;
  }

  try {
    const topics = await prisma.learningLog.findMany({
      where: {
        userId: userId,
        review: {
          none: {},
        },
      },
    });
const todaydate = new Date()
    const startOfDay = new Date(todaydate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(todaydate);
    endOfDay.setHours(23, 59, 59, 999);

    const miniTopics = await prisma.learningLog.findMany({
      where: {
        userId: userId,
        review: {
          some: {
            testResult: {
              some: {
                nextReviewDate: {
                  gte: startOfDay,
                  lte: endOfDay,
                },
              },
            },
          },
        },
      },
      include: {
        review: {
          include: {
            testResult: true,
          },
        },
      },
    });

    
    res.status(200).json({
      message: "Revision Fetched Successfully",
      topics,
      miniTopics,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Not Responded",
    });
  }
};
