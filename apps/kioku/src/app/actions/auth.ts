"use server";
import axios from "axios";
import type { UserResource } from "@clerk/types";
import { auth } from "@clerk/nextjs/server";

export const signIn = async ({
  email,
  imgUrl,
  name,
  userId,
}: {
  email: string;
  imgUrl: string;
  name: string;
  userId: string;
}) => {
  const { getToken } = await auth();
  const token = getToken();
  if (!token) {
    return null;
  }

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/user/check-user`,
    {
      email,
      imgUrl,
      name,
      userId,
    },{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(res);

  return res.status;
};
