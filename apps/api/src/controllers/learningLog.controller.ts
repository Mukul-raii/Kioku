import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  testGenerateModel,
  resultGenerateModel,
  subTopicTestGeneration,
} from "../libs/genai";
import redis from "../libs/redis";
import { log } from "@repo/logger";
const prisma = new PrismaClient();

export const createNewLearningLog = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    user,
    topic,
    notes,
    date,
    category,
  }: {
    user: string;
    topic: string;
    notes: string;
    date: string;
    category: string;
  } = req.body.data;
console.log(typeof(date));

  if (!user || !topic || !notes || !date || !category) {
    res.status(400).json({
      message: "All fields are required",
    });
    console.log("all fields are required", category);

    return;
  }
  const newLearningLog = await prisma.learningNote.create({
    data: {
      userId: user,
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
  const { userId } = req.query as { userId: string };

  const cachedLearningLogs = await redis.get(`learningLogs:${userId}`);
  const cachedLearningLogsStats = await redis.get(`learningLogsStats:${userId}`);

  if(cachedLearningLogs && cachedLearningLogsStats){
    res.status(200).json({
      message:"Learning Logs Fetched Successfully",
      learningLogs: JSON.parse(cachedLearningLogs),
      learningLogsWithStats: JSON.parse(cachedLearningLogsStats),
    })
    return
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

  await redis.set(`learningLogsStats:${userId}`, JSON.stringify(learningLogsWithStats), "EX", 60*60)
  await redis.set(`learningLogs:${userId}`, JSON.stringify(learningLogs), "EX", 60*60)

  res.status(200).json({
    message: "Learning Logs Fetched Successfully",
    learningLogs,
    learningLogsWithStats,
  });
};

export const updateLearningLog = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { logId } = req.params;
  const { notes, topic, category } = req.body;

  if (logId === undefined || null) {
    res.status(404).json({
      message: "Id is required",
    });
    return;
  }

  const learningLog = await prisma.learningNote.update({
    where: {
      id: parseInt(logId),
    },
    data: {
      category,
      topic,
      notes,
    },
  });
};

export const getAllLearningLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.query as { userId: string };
  
  if (!userId) {
    res.status(400).json({
      message: "User Id is required",
    });
  }
  const cachedLearningLogs=await redis.get(`learningLogs:${userId}`)
  if(cachedLearningLogs){
    res.status(200).json({
      message: "Learning Logs Fetched Successfully",
      learningLogs: JSON.parse(cachedLearningLogs),
    })
  }

  const learningLogs = await prisma.learningNote.findMany({
    where: { userId },
  });

  res.status(200).json({
    message: "Learning Logs Fetched Successfully",
    learningLogs,
  });
};

export const deleteLearningLog = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId =req.auth.userId

  if (!id) {
    res.status(400).json({
      message: "Id is required",
    });
    return
  }

  const learningLog = await prisma.learningNote.delete({
    where: {
      id: parseInt(id),
    },
  });

  await redis.del(`learningLogs:${userId}`, `learningLogsStats:${userId}`)

  res.status(200).json({
    message: "Learning Log Deleted Successfully",
    learningLog,
  });
};

export const generate_a_Test = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, isSubTopic } = req.query as { id: string; isSubTopic: string }; //learning log id

  if (id === undefined || null) {
    res.status(400).json({
      message: "Id is required",
    });
    return;
  }

  if (parseInt(isSubTopic) !== 0) {
    const learningLog = await prisma.learningNote.findMany({
      where: {
        id: parseInt(id),
      },
      include: {
        review: {
          include: {
            testResult: {
              where: {
                id: parseInt(isSubTopic),
              },
            },
          },
        },
      },
    });

    if (!learningLog) {
      res.status(400).json({
        message: "Learning Log Not Found",
      });
    }
    const subTopic = learningLog[0].review[0].testResult[0];

    const test = await subTopicTestGeneration(
      `"Sub-Topic:"${subTopic.miniTopic}+ "Notes/syllabus of full Topic:" +${learningLog[0].notes}`
    );

    res.status(200).json({
      message: "Test Generated Successfully",
      test: test,
    });
  } else {
    const learningLog = await prisma.learningNote.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!learningLog) {
      res.status(400).json({
        message: "Learning Log Not Found",
      });
    }

    const test = await testGenerateModel(
      `"Topic:"${learningLog?.topic}+ "Notes/syllabus:" +${learningLog?.notes}`
    );

    res.status(200).json({
      message: "Test Generated Successfully",
      test: test,
    });
  }
};

export const check_The_Result = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { question, correctAnswer, userAnswer } = req.body; //learning log id

  const testAnswer = await resultGenerateModel(
    `"Question: "${question}+",Correct Answer :"+${correctAnswer}+" User Answer To Check: " +${userAnswer}`
  );

  res.status(200).json({
    message: "Check Generated Successfully",
    test: testAnswer,
  });
};

export const generate_a_Result_New_Topic = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, result } = req.body; //learning log id

  const resa = Object.values(
    result.reduce((acc, item) => {
      if (!acc[item.subTopic]) {
        acc[item.subTopic] = { ...item, totalNumber: 1 };
      } else {
        acc[item.name].rating += item.rating;
        acc[item.name].totalNumber += 1;
      }
      return acc;
    }, {})
  );

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
        })),
      },
    },
  });

  res.status(400).json({
    message: "Result Generated Successfully",
  });
};

export const generate_a_Result_Sub_Topic = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, result } = req.body; //learning log id
  const ratedResults = result.filter((item) => item.rating !== null);

  const total = ratedResults.reduce((sum, item) => sum + item.rating, 0);
  const ratingAvg: number =
    ratedResults.length > 0 ? total / ratedResults.length : 0;

  const previoustest = await prisma.testResults.findFirst({
    where: {
      id,
    },
  });

  function calculateInterval() {
    let interval;
    let EF = previoustest?.EF || 2.5;
    if (ratingAvg >= 3) {
      if (previoustest?.RepetitionCount == 1) interval = 2;
      else if (previoustest?.RepetitionCount == 2) interval = 6;
      else interval = previoustest?.currentInterval || 1 * EF;
      EF = EF + (0.1 - (5 - ratingAvg) * (0.08 + (5 - ratingAvg) * 0.02));
      EF = Math.max(EF, 1.3);
    }
    return { interval, EF };
  }

  const { interval, EF } = calculateInterval();

  const reviewGenerate = await prisma.testResults.update({
    where: {
      id: id,
    },
    data: {
      lastScore: ratingAvg,
      EF: EF,
      currentInterval: interval, // interval is days until next review
      RepetitionCount: previoustest?.RepetitionCount, // repetition count is how many successful reviews you had
      nextReviewDate: new Date(
        new Date().setDate(new Date().getDate() + interval)
      ),
    },
  });

  res.status(400).json({
    message: "Result Generated Successfully",
  });
};
