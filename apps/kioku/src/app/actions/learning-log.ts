"use server";
import { New_Learning_Log } from "@repo/types";
import axios from "axios";
import { auth } from "@clerk/nextjs/server";

export const getAllLearningLogs = async (userId: string) => {
  const { getToken } = await auth();
  const token = await getToken();
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/learningLog`,
    {
      params: {
        userId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};




export const get_all_learning_Log_stats = async () => {
  const { userId, getToken } = await auth();
  const token = await getToken();
console.log(token,userId);

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/learningLog/get_all_learning_Log_stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        userId,
      },
    }
  );
  

    console.log(response);
    return response.data;

};

export const newLearningLogs = async (data: New_Learning_Log) => {
  const { getToken } = await auth();
  const token = await getToken();
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/learningLog/new_learning_log`,
    { data },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
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
  const { getToken } = await auth();
  const token = await getToken();

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/learningLog/check_test_result`,
    { question, correctAnswer, userAnswer },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.test;
};

export const get_a_test = async (id: number, isSubtopic: number) => {
  const { getToken } = await auth();
  const token = await getToken();
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/learningLog/get_a_test`,
    {
      params: {
        id,
        isSubTopic: isSubtopic.toString(),
      },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.test;
};

export const get_a_test_result = async (id: number, result) => {
  const { getToken } = await auth();
  const token = await getToken();
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/learningLog/get_a_test_result`,
    { id, result },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response);

  return response.data;
};

export const get_a_test_result_sub_topic = async (id: number, result) => {
  const { getToken } = await auth();
  const token = await getToken();

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/learningLog/get_a_sub_test_result`,
    { id, result },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response);
};
