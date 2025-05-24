import { PrismaClient } from "@prisma/client";
import { generate_test_model } from "../libs/genai";
const prisma = new PrismaClient();

export class generate_a_new_Test {
  static async generateTest(params: {
    learningLogId: number;
    userId: string;
    subTopicId?: number;
    mode: string;
    difficulty: string;
  }) {
    const { learningLogId, userId, subTopicId, mode, difficulty } = params;
    if (subTopicId) {
      return await this.generate_sub_topic_test(learningLogId,userId,subTopicId,mode,difficulty);
    } else {
      return await this.generate_main_topic_test(learningLogId, userId, mode, difficulty);
    }
  }

  private static async generate_sub_topic_test(
    learningLogId: number,
    userId: string,
    subTopicId: number,
    mode: string,
    difficulty: string
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

    return await generate_test_model.generateTest({prompt ,mode,difficulty,isSubTopic:true});
  }

  private static async generate_main_topic_test(
    learningLogId: number,
    userId: string,
    mode: string,
    difficulty: string
  ) {
      console.log("generating main topic test 2 ");

      const learningLog = await prisma.learningNote.findUnique({
      where: { id: learningLogId, userId },
    });
      console.log("learning log ",learningLog);

    if (!learningLog) {
      throw new Error("Learning log not found");
    }

    const prompt = `Topic: ${learningLog.topic}\nNotes: ${learningLog.notes}`;
    return await generate_test_model.generateTest({prompt,mode,difficulty,isSubTopic:false});
  }
}




/* export class generate_a_result{
    static async generateResult(params:{
       id: number,
       result: string,
       userId:string
    })
}
 */

