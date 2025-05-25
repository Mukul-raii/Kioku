// src/index.ts
export * from "./userAuth.types";
export * from "./notes.types";
export * from "./reviewList"
import z from 'zod'


export const userSchema=z.object({
  id:z.string(),
  name:z.string(),
  email:z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
})

export type User = z.infer<typeof userSchema>

export interface Red {
  id: string;
  name: string;
  email: string;
}

export type Answered = {
  question: string;
  answer: string;
  subTopic: string;
  rating: number;
};

export interface New_Learning_Log {
  topic: string;
  category: string;
  notes: string;
  date: Date;
  user: string;
}
