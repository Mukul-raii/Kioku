"use server"
import axios from "axios";
import { auth } from "@clerk/nextjs/server";


export const getAllRevision = async (userId: string) => {
  const { getToken } = await auth();
  const token = await getToken();



  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/review/get_all_revision_topic`,
    { userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response);

  return response.data;
};



export const getProgress = async () => {
  const { userId,getToken } = await auth();
  const token = await getToken();

  
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/review/getProgress`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params:{
          userId
        }
      }
    );
    return response.data;

};
