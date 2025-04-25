import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  testGenerateModel,
  resultGenerateModel,
  subTopicTestGeneration,
} from "../libs/genai";
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
    date: Date;
    category: string;
  } = req.body.data;

  try {
    if (!user || !topic || !notes || !date || !category) {
      res.status(400).json({
        message: "All fields are required",
      });
      console.log(
        "all fields are required",
        user,
        topic,
        notes,
        date,
        category
      );

      return;
    }
    const newLearningLog = await prisma.learningLog.create({
      data: {
        userId: user,
        topic,
        notes,
        date,
        category,
      },
    });
    console.log(newLearningLog);
    res.status(200).json({
      message: "Learning Log created successfully",
      newLearningLog,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

export const getLearningLogStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.query as { userId: string };
  console.log(userId);

  try {
    const learningLogs = await prisma.learningLog.findMany({
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
console.log(JSON.stringify(learningLogs));

    const learningLogsWithStats = learningLogs.map((learningLog) => {
      const testResult = learningLog.review?.[0]?.testResult || []
      console.log(testResult);

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

    res.status(200).json({
      message: "Learning Logs Fetched Successfully",
      learningLogs,learningLogsWithStats
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Not Responded",
    });
  }
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

  try {
    const learningLog = await prisma.learningLog.update({
      where: {
        id: parseInt(logId),
      },
      data: {
        category,
        topic,
        notes,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Not Responded",
    });
  }
};

export const getAllLearningLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.query as { userId: string };

  try {
    if (!userId) {
      res.status(400).json({
        message: "User Id is required",
      });
    }

    const learningLogs = await prisma.learningLog.findMany({
      where: { userId },
    });

    res.status(200).json({
      message: "Learning Logs Fetched Successfully",
      learningLogs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Not Responded",
    });
  }
};

export const deleteLearningLog = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    if (!id) {
      res.status(400).json({
        message: "Id is required",
      });
    }

    const learningLog = await prisma.learningLog.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      message: "Learning Log Deleted Successfully",
      learningLog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Not Responded",
    });
  }
};

export const generate_a_Test = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, isSubtopic } = req.query as { id: string; isSubtopic: string }; //learning log id

  if (id === undefined || null) {
    res.status(400).json({
      message: "Id is required",
    });
    return;
  }

  try {
    if (parseInt(isSubtopic) !== 0) {
      const learningLog = await prisma.learningLog.findMany({
        where: {
          id: parseInt(id),
        },
        include: {
          review: {
            include: {
              testResult: {
                where: {
                  id: parseInt(isSubtopic),
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
      const learningLog = await prisma.learningLog.findUnique({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Not Responded",
      error: {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
      },
    });
  }
};

export const check_The_Result = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { question, correctAnswer, userAnswer } = req.body; //learning log id

  try {
    const testAnswer = await resultGenerateModel(
      `"Question: "${question}+",Correct Answer :"+${correctAnswer}+" User Answer To Check: " +${userAnswer}`
    );

    res.status(200).json({
      message: "Check Generated Successfully",
      test: testAnswer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Not Responded",
    });
  }
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

  try {
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
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Not Responded",
    });
  }
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
  console.log(id, previoustest);

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

  try {
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
    console.log(reviewGenerate);

    res.status(400).json({
      message: "Result Generated Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Not Responded",
    });
  }
};
