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

    const miniTopics = await prisma.learningLog.findMany({
      where: {
        userId: userId,
        review: {
          some: {
            testResult: {
              some: {
                currentInterval: {
                  lte: 1,
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
