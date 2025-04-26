// src/index.ts
export * from "./userAuth.types";
export * from "./notes.types";

export interface User {
  id: string;
  name: string;
  email: string;
}

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
