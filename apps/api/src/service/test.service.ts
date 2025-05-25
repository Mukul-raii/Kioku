import { PrismaClient } from "@prisma/client";
import { generate_test_model } from "../libs/genai";
import { promise } from "zod/v4";
const prisma = new PrismaClient();

export class TestGenerateModel {
  static async generateTest(param: {
    prompt: string;
    mode: string;
    difficulty: string;
    isSubTopic: boolean;
  }) {
    return await generate_test_model.generateTest(param);
  }
}

export class LearningLogTestService {
  static async generateTest(params: {
    learningLogId: number;
    userId: string;
    subTopicId?: number;
    mode: string;
    difficulty: string;
  }) {
    const { learningLogId, userId, subTopicId, mode, difficulty } = params;
    if (subTopicId) {
      const prompt = await this.buildSubTopicPrompt(
        learningLogId,
        userId,
        subTopicId
      );
      return TestGenerateModel.generateTest({
        prompt,
        mode,
        difficulty,
        isSubTopic: true,
      });
    } else {
      const prompt = await this.buildMainTopicPrompt(learningLogId, userId);
      return TestGenerateModel.generateTest({
        prompt,
        mode,
        difficulty,
        isSubTopic: false,
      });
    }
  }

  private static async buildSubTopicPrompt(
    learningLogId: number,
    userId: string,
    subTopicId: number
  ) {
    const learningLog = await prisma.learningNote.findFirst({
      where: { id: learningLogId, userId },
      include: {
        review: {
          include: {
            testResult: {
              where: { id: subTopicId },
            },
          },
        },
      },
    });

    if (!learningLog?.review?.[0]?.testResult?.[0]) {
      throw new Error("Sub-topic not found");
    }
    const subTopic = learningLog.review[0].testResult[0];
    const prompt = `Sub-Topic: ${subTopic.miniTopic}\nNotes: ${learningLog.notes}`;

    return prompt;
  }

  private static async buildMainTopicPrompt(
    learningLogId: number,
    userId: string
  ) {
    console.log("generating main topic test 2 ");

    const learningLog = await prisma.learningNote.findUnique({
      where: { id: learningLogId, userId },
    });
    console.log("learning log ", learningLog);

    if (!learningLog) {
      throw new Error("Learning log not found");
    }

    const prompt = `Topic: ${learningLog.topic}\nNotes: ${learningLog.notes}`;
    return prompt;
  }
}

export class QuickTestGenerationService {
  static async BuildBasicQuickTest(params: {
    quickTestId?: number;
    subTopicId?: number;
    topic: string;
    category: string;
    mode: string;
    difficulty: string;
    userId: string;
  }) {
    const { topic, category, mode, difficulty, quickTestId, subTopicId } =params;
    if (quickTestId) {
      const prompt = await this.buildQuizBasedQuickTest(params);
      return await generate_test_model.generateQuizTest({prompt,mode,difficulty});
    } else {
      console.log("BUILDING THE QUICK TEST");
      
      const prompt = this.buildBasicQuickTestPrompt({ topic, category });
      return generate_test_model.generateQuizTest({prompt,mode,difficulty}) 
    }
  }

  static async buildNotesBasedQuickTest(params: {
    // if we want to generate a quick test based on notes and also store  its  result
    learningLogId: number; // there is confusion here if we use prebuild logtestesrvice it will regenerate the subtopic since in prompt we will send the topic and notes not prebuilt subtopic list
    userId: string;
    mode: string;
    difficulty: string;
    subTopicId?: number;
  }) {
    const { learningLogId, userId, mode, difficulty } = params;
    
    const prompt =await this.buildNoteBasedTestPrompt(params)
    return generate_test_model.generateTest({prompt,mode,difficulty}) 
  }

  private static async buildNoteBasedTestPrompt(params: {
    learningLogId: number; // there is confusion here if we use prebuild logtestesrvice it will regenerate the subtopic since in prompt we will send the topic and notes not prebuilt subtopic list
    userId: string;
    mode: string;
    difficulty: string;
  }) {
    const {learningLogId,userId,mode,difficulty } = params;
    const learningLogData = await prisma.learningNote.findFirst({
      where: {
        id: learningLogId,
      },
      include: {
        review: {
          include: {
            testResult: true,
          },
        },
      },
    });
  if (!learningLogData) {
    throw new Error("Learning log not found");
  }

    const subTopics = learningLogData?.review
      .flatMap((review) => review.testResult)
      .map((result) => result.miniTopic)
      .filter((topic, index, arr) => arr.indexOf(topic) === index || []);

      if(!subTopics) return
    
    const subTopicsText = subTopics.length > 0 
    ? `SubTopics: ${subTopics.join(', ')}` 
    : '';

    return `Generate a comprehensive test on the following topic:
    Topic: ${learningLogData?.topic}
    Category: ${learningLogData?.category}
    ${subTopicsText}
    Create questions that test fundamental understanding and key concepts.`;
  }

  private static async buildQuizBasedQuickTest(params: {
    quickTestId?: number;
    topic: string;
    category: string;
    mode: string;
    difficulty: string;
    userId: string;
  }) {
    const { topic, category, mode, difficulty, quickTestId } = params;
    const quickTestData = await prisma.quickQuiz.findFirst({
      where: {
        id: quickTestId,
      },
      include: {
        review: {
          include: {
            testResult: true,
          },
        },
      },
    });

    const subTopics = quickTestData?.review
      .flatMap((review) => review.testResult)
      .map((result) => result.miniTopic)
      .filter((topic, index, arr) => arr.indexOf(topic) === index || []);

    return this.buildBasicQuickTestPrompt({ topic, subTopics, category });
  }

  private static buildBasicQuickTestPrompt(params: {
    topic: string;
    subTopics?: any;
    category: string;
  }) {
    const { topic, category, subTopics } = params;
  
    return `Generate a comprehensive test on the following topic:
    Topic: ${topic}
    Category: ${category}
    ${subTopics}
    Create questions that test fundamental understanding and key concepts.`;
  }
}
