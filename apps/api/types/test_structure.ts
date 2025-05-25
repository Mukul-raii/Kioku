import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API });
const genai = new GoogleGenerativeAI(`${process.env.GOOGLE_GENAI_API}`);

export const SUB_TOPIC_TEST_STRUCTURE_TEMPLATE_LONG_ANSWER = {
  testType: "subtopic",
  format: "long_answer",
  structure: {
    subtopic: {
      name: "string - Name of the specific subtopic being tested",
      description: "string - Brief description of the subtopic content",
      totalQuestions: "number - Total number of questions for this subtopic",
      estimatedTime: "number - Estimated completion time in minutes",
      questions: [
        {
          id: "string - Unique question identifier",
          question: "string - The long answer question text",
          type: "long_answer",
          answer: "string - Detailed correct answer or model response",
          hint: "string - Helpful hint to guide the learner",
          keyPoints: [
            "string - Key point 1 that should be covered in answer",
            "string - Key point 2 that should be covered in answer",
            "string - Key point 3 that should be covered in answer",
          ],
          difficulty: "easy|medium|hard",
          points: "number - Points awarded for correct answer",
          expectedLength: "number - Expected word count for answer",
          rubric: {
            excellent: "string - Criteria for 90-100% score",
            good: "string - Criteria for 70-89% score",
            satisfactory: "string - Criteria for 50-69% score",
            needs_improvement: "string - Criteria for below 50% score",
          },
        },
      ],
    },
  },
};

export const MAIN_TOPIC_TEST_STRUCTURE_TEMPLATE_LONG_ANSWER = {
  testType: "main_topic",
  format: "long_answer",
  structure: {
    topic: "string - Main topic name",
    description: "string - Overview of what the entire test covers",
    totalSubtopics: "number - Number of subtopics covered",
    totalQuestions: "number - Total questions across all subtopics",
    estimatedTime: "number - Total estimated time in minutes",
    passingScore: "number - Minimum percentage to pass",
    subtopics: [
      {
        name: "string - Subtopic name",
        description: "string - What this subtopic covers",
        weight: "number - Percentage weight in overall score",
        questions: [
          {
            id: "string - Unique question identifier",
            question: "string - The long answer question text",
            type: "long_answer",
            answer: "string - Detailed model answer or expected response",
            hint: "string - Helpful hint to guide the learner",
            keyPoints: [
              "string - Key concept 1 that should be mentioned",
              "string - Key concept 2 that should be mentioned",
              "string - Key concept 3 that should be mentioned",
            ],
            difficulty: "easy|medium|hard",
            points: "number - Points for this question",
            expectedLength: "number - Expected word count",
            rubric: {
              excellent: "string - Criteria for excellent answer (90-100%)",
              good: "string - Criteria for good answer (70-89%)",
              satisfactory:
                "string - Criteria for satisfactory answer (50-69%)",
              needs_improvement: "string - Criteria for poor answer (0-49%)",
            },
          },
        ],
      },
    ],
  },
};

export const SUB_TOPIC_TEST_STRUCTURE_TEMPLATE_MCQS = {
  testType: "subtopic",
  format: "mcq",
  structure: {
    subtopic: {
      name: "string - Name of the specific subtopic being tested",
      description: "string - Brief description of the subtopic content",
      totalQuestions:
        "number - Total number of MCQ questions for this subtopic",
      estimatedTime: "number - Estimated completion time in minutes",
      questions: [
        {
          id: "string - Unique question identifier",
          question: "string - The multiple choice question text",
          type: "mcq",
          options: [
            "string - Option A text",
            "string - Option B text",
            "string - Option C text",
            "string - Option D text",
          ],
          correctAnswer: "string - The correct option (A, B, C, or D)",
          correctAnswerIndex: "number - Index of correct answer (0-3)",
          explanation: "string - Why the correct answer is right",
          hint: "string - Helpful hint to guide the learner",
          difficulty: "easy|medium|hard",
          points: "number - Points awarded for correct answer",
          distractors: {
            wrongOption1: "string - Why option is incorrect",
            wrongOption2: "string - Why option is incorrect",
            wrongOption3: "string - Why option is incorrect",
          },
        },
      ],
    },
  },
};

export const MAIN_TOPIC_TEST_STRUCTURE_TEMPLATE_MCQS = {
  testType: "main_topic",
  format: "mcq",
  structure: {
    topic: "string - Main topic name",
    description: "string - Overview of what the entire MCQ test covers",
    totalSubtopics: "number - Number of subtopics covered",
    totalQuestions: "number - Total MCQ questions across all subtopics",
    estimatedTime: "number - Total estimated time in minutes",
    passingScore: "number - Minimum percentage to pass",
    questionsPerSubtopic: "number - Number of questions per subtopic",
    subtopics: [
      {
        name: "string - Subtopic name",
        description: "string - What this subtopic covers",
        weight: "number - Percentage weight in overall score",
        questionCount: "number - Number of questions from this subtopic",
        questions: [
          {
            id: "string - Unique question identifier",
            question: "string - The multiple choice question text",
            type: "mcq",
            options: [
              "string - Option A text",
              "string - Option B text",
              "string - Option C text",
              "string - Option D text",
            ],
            correctAnswer: "string - The correct option (A, B, C, or D)",
            correctAnswerIndex: "number - Index of correct answer (0-3)",
            explanation:
              "string - Detailed explanation of why answer is correct",
            hint: "string - Helpful hint to guide the learner",
            difficulty: "easy|medium|hard",
            points: "number - Points for this question",
            category: "string - Specific category within subtopic",
            distractors: {
              wrongOption1: "string - Why this option is incorrect",
              wrongOption2: "string - Why this option is incorrect",
              wrongOption3: "string - Why this option is incorrect",
            },
          },
        ],
      },
    ],
  },
};


