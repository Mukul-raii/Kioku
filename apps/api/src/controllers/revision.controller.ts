import { PrismaClient } from "@prisma/client";
import { log } from "@repo/logger";
import { Request, Response } from "express";
import redis from "../libs/redis";
const prisma = new PrismaClient();
const mockDate = new Date();
mockDate.setDate(mockDate.getDate() + 0); // Move to next day

const OriginalDate = Date;
global.Date = class extends OriginalDate {
  constructor(...args: any[]) {
    return args.length ? new OriginalDate(...args) : mockDate;
  }
} as typeof Date;

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
    const cachedTopics = await redis.get(`topics:${userId}`);
    const cachedMiniTopics = await redis.get(`miniTopics:${userId}`);

      if(cachedTopics && cachedMiniTopics){
       res.status(200).json({
        message: "Revision Fetched Successfully",
        topics: JSON.parse(cachedTopics),
        miniTopics: JSON.parse(cachedMiniTopics),
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
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(todaydate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    console.log({ startOfDay, endOfDay });

    log("starting for gettinrevision cached ", startOfDay, endOfDay);
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

    await redis.set(`topics:${userId}`, JSON.stringify(topics), "EX", 60 * 10);
    await redis.set(
      `miniTopics:${userId}`,
      JSON.stringify(miniTopics),
      "EX",
      60 * 10
    );
    log("end for gettinrevision cached ");
    res.status(200).json({
      message: "Revision Fetched Successfully",
      topics,
      miniTopics,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const getProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.query as { userId: string };

    const learningLogs = await prisma.learningLog.findMany({
      where: { userId },
      include: {
        review: {
          include: {
            testResult: true,
          },
        },
        Category: true,
      },
    });

    const today = new Date();

    const testResult = learningLogs.flatMap((log) =>
      log.review.flatMap((review) =>
        review.testResult.map((q) => ({
          ...q,
          category: log.Category?.catergoryName || "Uncategorized",
          logDate: log.date,
        }))
      )
    );

    // Filter results for the current month
    const reviewThisMonth = testResult.filter((item) => {
      const reviewDate = new Date(item.nextReviewDate);
      return (
        reviewDate.getMonth() === today.getMonth() &&
        reviewDate.getFullYear() === today.getFullYear()
      );
    });

    // Calculate total score and retention rate
    const totalScore = reviewThisMonth.reduce(
      (acc, entry) => acc + entry.lastScore,
      0
    );
    const retention =
      reviewThisMonth.length > 0
        ? parseFloat((totalScore / reviewThisMonth.length).toFixed(2))
        : null;

    // Mastered Topics: repeated 3+ times and score >= 4
    const masteredTopics = testResult.filter(
      (entry) => entry.RepetitionCount >= 3 && entry.lastScore >= 4
    );
    const masteredTopicCount = masteredTopics.length;

    // Activity Days in current month
    const activeDaysSet = new Set(
      testResult
        .map((r) => new Date(r.lastReviewed))
        .filter(
          (d) =>
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
        )
        .map((d) => d.toDateString())
    );
    const daysActiveThisMonth = activeDaysSet.size;

    // Upcoming Reviews in next 7 days
    const upcomingReviews = testResult.filter((entry) => {
      const next = new Date(entry.nextReviewDate);
      log("next", next);
      return (
        next > today &&
        next < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    });

    // Category-wise breakdown
    const categoryBreakdown: Record<
      string,
      { count: number; averageScore: number }
    > = {};
    testResult.forEach((entry) => {
      if (!categoryBreakdown[entry.category]) {
        categoryBreakdown[entry.category] = { count: 0, averageScore: 0 };
      }
      categoryBreakdown[entry.category].count += 1;
      categoryBreakdown[entry.category].averageScore += entry.lastScore;
    });
    for (const key in categoryBreakdown) {
      const data = categoryBreakdown[key];
      data.averageScore = parseFloat(
        (data.averageScore / data.count).toFixed(2)
      );
    }

    // Most reviewed miniTopics
    const topicFrequency: Record<string, number> = {};
    testResult.forEach((entry) => {
      topicFrequency[entry.miniTopic] =
        (topicFrequency[entry.miniTopic] || 0) + 1;
    });
    const topTopics = Object.entries(topicFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, freq]) => ({ topic, freq }));

    // Recent Logs
    const recentLogs = learningLogs
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5)
      .map((log) => ({
        topic: log.topic,
        date: log.date,
        category: log.Category?.catergoryName || "Uncategorized",
      }));

    // Missed Reviews: past review dates that weren't done
    const missedReviews = testResult.filter((entry) => {
      const next = new Date(entry.nextReviewDate);
      return next < today && new Date(entry.lastReviewed) < next;
    });

    res.status(200).json({
      message: "Progress analytics fetched successfully",
      retention,
      totalScore,
      masteredTopicCount,
      masteredTopics,
      reviewThisMonthCount: reviewThisMonth.length,
      daysActiveThisMonth,
      upcomingReviewCount: upcomingReviews.length,
      upcomingReviews,
      categoryBreakdown,
      topTopics,
      recentLogs,
      missedReviewCount: missedReviews.length,
    });
  } catch (error) {
    console.error("Error in getProgress:", error);
    res.status(500).json({ message: "Failed to fetch progress", error });
  }
};
