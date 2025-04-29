import { clerkClient } from "@clerk/express";
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

    const topics = await prisma.learningLog.findMany({
      where: {
        userId: userId,
        review: {
          none: {},
        },
      },
    });
    const todaydate = new Date();
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
};

export const getProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("startin");

    const { userId } = req.query as { userId: string };
    const userid = await clerkClient.users.getUser(userId?.toString() || " ");

    const learningLogs = await prisma.learningLog.findMany({
      where: {
        userId: userId,
      },
      include: {
        review: {
          include: {
            testResult: true,
          },
        },
      },
    });

    const testResult = learningLogs.flatMap((review) =>
      review.review.flatMap((item) =>
        item.testResult.map((q) => ({
          id: q.id,
          lastScore: q.lastScore,
          repetitionCount: q.RepetitionCount,
          nextReviewDate: q.nextReviewDate,
          miniTopic: q.miniTopic,
          interval: q.currentInterval,
          category: review.category,
        }))
      )
    );
    const today = new Date()

      const reviewThisMonth = testResult.filter((item) =>{
        const review = new Date(item.nextReviewDate)
        console.log(today);
        
        return review.getMonth() === today.getMonth() && review.getFullYear() === today.getFullYear()
      })
      const totalScore=reviewThisMonth.reduce((acc,entry)=> acc+entry.lastScore,0)
      const retention= reviewThisMonth.length > 0 
        ? ( totalScore/reviewThisMonth.length).toFixed(2) 
        :"No reviews this month"

      const masteredTopics = testResult.filter((entry)=>entry.repetitionCount>=3 && entry.lastScore>=4)
      const masteredTopicCount = masteredTopics.length;


    res.status(200).json({
      message: "Revision Fetched Successfully",
        learningLogs:learningLogs,
        reviewThisMonth,
        totalScore,
        retention,
        masteredTopics,
        masteredTopicCount
    });
};
