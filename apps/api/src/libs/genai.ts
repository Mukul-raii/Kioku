import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API });
const genai = new GoogleGenerativeAI(`${process.env.GOOGLE_GENAI_API}`);

/* export const testGenerateModel: GenerativeModel = genai.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    
});

export const resultGenerateModel: GenerativeModel = genai.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You will receive a question, the correct answer, and the user's answer. Evaluate the user's answer based on clarity, correctness, and logical understanding — it does not need to match the correct answer exactly, as the correct answer may be AI-generated. If the user clearly understood and answered the question well, give 3 stars. If the answer is mostly correct or shows partial understanding, give 2 stars. If it is incorrect or shows poor understanding, give 0 stars. Return a valid JSON object containing the question, a 'rate' field with the number of stars, and a brief summary with advice or corrections for the user's answer. Do not include unnecessary spaces or wrap the result in ```json or any code block.",
}); */

export async function testGenerateModel(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        systemInstruction: {
          parts: [
            {
              text: `You are an expert content analyzer. For provided text:
1. Identify and extract key 2 subtopics only
2. For each subtopic, generate:
   -  1 relevant questions
   - Clear correct answers
   - Helpful hints
3. Return as JSON with this exact structure:
${JSON.stringify({
  subtopics: [
    {
      name: "Subtopic Name",
      questions: [
        {
          question: "Question text",
          answer: "Correct answer",
          hint: "Hint text",
        },
      ],
    },
  ],
})}
NO markdown formatting, ONLY valid JSON.`,
            },
          ],
        },
      },
    });

    // Extract and parse JSON from response
    const cleanJson = response && response?.text?.replace(/```json|```/g, "");
    return cleanJson;
  } catch (error) {
    console.error("Generation failed:", error);
    throw new Error("Content generation failed. Please try again.");
  }
}



export async function subTopicTestGeneration(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        systemInstruction: {
          parts: [
            {
              text: `You are an expert content analyzer. For provided text:
1. Identify subTopic i given and extract subtopics content from notes 
2. For  subtopic, generate:
   -   relevant questions
   - Clear correct answers
   - Helpful hints
3. Return as JSON with this exact structure:
${JSON.stringify({
  subtopics: [
    {
      name: "Subtopic Name",
      questions: [
        {
          question: "Question text",
          answer: "Correct answer",
          hint: "Hint text",
        },
      ],
    },
  ],
})}
NO markdown formatting, ONLY valid JSON.`,
            },
          ],
        },
      },
    });

    // Extract and parse JSON from response
    const cleanJson = response && response?.text?.replace(/```json|```/g, "");
    return cleanJson;
  } catch (error) {
    console.error("Generation failed:", error);
    throw new Error("Content generation failed. Please try again.");
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
