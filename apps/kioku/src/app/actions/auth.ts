"use server";
import axios from "axios";
import { auth } from "@clerk/nextjs/server";
import { userDetails } from "@repo/types";

export const signIn = async ({ email, imgUrl, name, userId }: userDetails) => {
  const { getToken } = await auth();
  const token = getToken();

  if (!token) return null;

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/user/check-user`,
    { email, imgUrl, name, userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.status;
};
