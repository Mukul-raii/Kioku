import { New_Learning_Log } from "@repo/types";
import axios from "axios";

export const getAllLearningLogs = async (userId: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/learningLog?userId=${userId}`
  );
  return response.data;
};

export const newLearningLogs = async (data: New_Learning_Log) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/learningLog/new_learning_log`,
    { data }
  );
  console.log("llresopnsl  ", response);
  return response.data;
};

export const check_test_result = async ({
  question,
  correctAnswer,
  userAnswer,
}: {
  question: string;
  correctAnswer: string;
  userAnswer: string;
}) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/learningLog/check_test_result`,
    { question, correctAnswer, userAnswer }
  );
  return response.data.test;
};

export const get_a_test = async (id: number, isSubtopic: number) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/learningLog/get_a_test?id=${id}`,
    { isSubtopic }
  );
  return response.data.test;
};

export const get_a_test_result = async (id: number, result) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/learningLog/get_a_test_result`,
    { id, result }
  );
  console.log(response);

  return response.data;
};

export const get_a_test_result_sub_topic = async (id: number, result) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/learningLog/get_a_sub_test_result`,
    { id, result }
  );
  console.log(response);
}