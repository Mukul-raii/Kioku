'use server';
import axios from 'axios';
import { auth } from '@clerk/nextjs/server';
import { userAuth } from '@repo/types';

export const signIn = async ({ email, imgUrl, name, userId }: userAuth) => {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) return null;
  console.log(token);

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/user/check-user`,
    { email, imgUrl, name, userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.status;
};
