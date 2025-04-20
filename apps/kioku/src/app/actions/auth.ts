import axios from "axios";
import type { UserResource } from "@clerk/types";

export const signIn = async (user:UserResource) => {
  if (!user) {
    return null;
  }
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_API}/user/check-user`,
    {
      email:user.primaryEmailAddress?.emailAddress,
      imgUrl:user.imageUrl,
      name:user.fullName,
      userId:user.id
    }
  );
  console.log(res);
  
  return res.status;
};

