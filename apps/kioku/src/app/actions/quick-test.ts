"use server";
import axios from "axios";
import { auth } from "@clerk/nextjs/server";
import { QuickTestParams } from "@repo/types";


export const createQuickTest = async (params: QuickTestParams) => {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error("Unauthorized - No token available");
  }
  console.log(params);
  
  try {
    const learningLogResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/quick_test/create`,
      {
        topic: params.topic,
        category: params.category,
        mode:params.mode,
        difficulty:params.difficulty,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    console.log(learningLogResponse);
    
    return {
      success: true,
      data: {
      },
    };
  } catch (error) {
    console.error("Error creating quick test:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create quick test"
    );
  }
};
