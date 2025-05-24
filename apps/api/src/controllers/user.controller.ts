import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {userAuthSchema,userAuth} from '@repo/types'

const prisma = new PrismaClient();

export const createNewUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, name, imgUrl, userId }:userAuth = req.body;
  
  if (!email || !name || !imgUrl || !userId) {
    res.status(400).json({
      message: "All fields are required",
    });
    return;
  }

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (user) {
    res.status(400).json({
      message: "User already exists",
    });
    return;
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      imageUrl: imgUrl || " ",
      userId: userId,
    },
  });

  res.status(200).json({
    message: "User created successfully",
    data: newUser,
  });
};
