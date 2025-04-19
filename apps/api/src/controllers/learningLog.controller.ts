import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { testGenerateModel, resultGenerateModel } from "../libs/genai";
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

export const getAllLearningLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.query;

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
  const id = req.query.id as string; //learning log id
  console.log(id);

  if (id === undefined || null) {
    res.status(400).json({
      message: "Id is required",
    });
    return;
  }

  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Not Responded",
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

export const generate_a_Result = async (
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

  console.log(resa);

  try {
    const reviewGenerate = await prisma.review.create({
      data: {
        logId: id,
        testResult: {
          create: resa.map((r: any) => ({
            miniTopic: r.subTopic,
            lastScore: r.rating / r.totalNumber,
            currentInterval:r.rating/r.totalNumber >=3 ?  1 : 0,
            RepetitionCount: 1,
            nextReviewDate: new Date()
          })),
        },
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
