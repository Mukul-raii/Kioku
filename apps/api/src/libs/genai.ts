import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";
import {
  MAIN_TOPIC_TEST_STRUCTURE_TEMPLATE_LONG_ANSWER,
  MAIN_TOPIC_TEST_STRUCTURE_TEMPLATE_MCQS,
  SUB_TOPIC_TEST_STRUCTURE_TEMPLATE_LONG_ANSWER,
  SUB_TOPIC_TEST_STRUCTURE_TEMPLATE_MCQS,
} from "../../types/test_structure";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API });

export const generate_test = async (params: {
  prompt: string;
  outputStructure: object;
  mode: string;
  difficulty: string;
}) => {
  const { prompt, outputStructure,difficulty } = params;
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt  }],
      },
    ],
    config: {
      systemInstruction: {
        parts: [
          {
            text: `You are an expert content analyzer. For provided text:
                    1. Identify and extract key subtopics only
                    2. Difficultly: ${difficulty}
                    2. For each subtopic, generate:
                       - sufficient relevant questions
                       - Clear correct answers
                       - Helpful hints
                    3. Return as JSON with this exact structure:
                    ${JSON.stringify({ outputStructure })}
                    NO markdown formatting, ONLY valid JSON.`,
          },
        ],
      },
    },
  });
  const cleanJson = response && response?.text?.replace(/```json|```/g, "");
  return cleanJson;
};

export class generate_test_model {
  static async generateTest(params: {
    prompt: string;
    mode: string;
    difficulty: string;
    isSubTopic: boolean;
  }) {
    const { prompt, mode, difficulty, isSubTopic } = params;
    if (isSubTopic) {
      return await this.generate_sub_topic_test({ prompt, mode, difficulty });
    } else {
      return await this.generate_main_topic_test({ prompt, mode, difficulty });
    }
  }

  static async generateQuizTest(params:{
    prompt: string;
    mode: string;
    difficulty: string;
  }){
    const { prompt, mode, difficulty } = params;
    console.log(prompt,mode,difficulty)
    let response;
    if (mode === "MCQs") {
      response = await generate_test({
        prompt,
        mode,
        difficulty,
        outputStructure: MAIN_TOPIC_TEST_STRUCTURE_TEMPLATE_MCQS,
      });
    } else {
      response = await generate_test({
        prompt,
        mode,
        difficulty,
        outputStructure: MAIN_TOPIC_TEST_STRUCTURE_TEMPLATE_LONG_ANSWER,
      });
    }
    return response;
  }

  private static async generate_sub_topic_test(params: {
    prompt: string;
    mode: string;
    difficulty: string;
  }) {
    const { prompt, mode, difficulty } = params;

    let response;
    if (mode === "MCQs") {
      response = await generate_test({
        prompt,
        mode,
        difficulty,
        outputStructure: SUB_TOPIC_TEST_STRUCTURE_TEMPLATE_MCQS,
      });
    } else {
      response = await generate_test({
        prompt,
        mode,
        difficulty,
        outputStructure: SUB_TOPIC_TEST_STRUCTURE_TEMPLATE_LONG_ANSWER,
      });
    }
    return response;
  }

  private static async generate_main_topic_test(params: {
    prompt: string;
    mode: string;
    difficulty: string;
  }) {
    const { prompt, mode, difficulty } = params;

    let response;
    if (mode === "MCQs") {
      response = await generate_test({
        prompt,
        mode,
        difficulty,
        outputStructure: MAIN_TOPIC_TEST_STRUCTURE_TEMPLATE_MCQS,
      });
    } else {
      response = await generate_test({
        prompt,
        mode,
        difficulty,
        outputStructure: MAIN_TOPIC_TEST_STRUCTURE_TEMPLATE_LONG_ANSWER,
      });
    }


    console.log("final test generated ",response);
    
    return response;
  }
}

export async function resultGenerateModel(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      systemInstruction:
        "Evaluate a user's answer to a given question using the following criteria: clarity, correctness, and logical understanding. The user's answer does not need to exactly match the provided correct answer, as the correct answer may be AI-generated. Assign a star rating: 3 stars for clear and correct answers that show full understanding, 2 stars for mostly correct or partially understood answers, and 0 stars for incorrect or poorly understood answers. Return your evaluation as a JSON object with the fields: 'question', 'rate' (number of stars), and 'summary' (a brief comment with feedback, advice, or corrections). Do not add extra spaces or formatting, and do not wrap the output in code blocks. Use only the information provided—do not include sample answers.",
    },
  });

  return response?.text?.replace(/```json|```/g, "");
}
