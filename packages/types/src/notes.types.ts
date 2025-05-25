import { z } from "zod";

export const newNoteSchema = z.object({
  user: z.string(),
  topic: z.string(),
  notes: z.string(),
  category: z.string(),
});

export type newNote = z.infer<typeof newNoteSchema>;

export interface GroupedNotes {
  message: string;
  topics: TopicsForRevision[];
  miniTopics: MiniTopicForRevision[];
}

export interface TopicsForRevision {
  id: number;
  userId: string;
  date: string;
  topic: string;
  category: string;
  notes: string;
  createdDate: string;
  categoryId: number | null;
}

export interface MiniTopicForRevision {
  id: number;
  userId: string;
  date: string;
  topic: string;
  category: string;
  notes: string;
  createdDate: string;
  categoryId: number | null;
  review?: Review[]; // review is optional because it might not exist
}

export interface Review {
  id: number;
  logId: number;
  createdDate: string;
  testResult?: TestResult[];
}

export interface TestResult {
  id: number;
  reviewId: number;
  EF: number;
  miniTopic: string;
  lastScore: number;
  currentInterval: number;
  RepetitionCount: number;
  nextReviewDate: string;
  lastReviewed: string;
}

export interface SubTopicAggregate {
  id: number;
  category: string;
  miniTopic: string;
  reviewDate: string;
  test: number;
  lastScore: number;
}

//For My note page

export interface LearningLogWithStats extends MiniTopicForRevision {
  totalSubTopic: number;
  retention: number | null;
}

export interface LearningLogsResponse {
  message: string;
  learningLogs: MiniTopicForRevision[];
  learningLogsWithStats: LearningLogWithStats[];
}




export const quickTestSchema = z.object({
    category: z.string().min(1, "Category is required"),
    topic: z.string().min(1, "Topic is required"),
    difficulty: z.enum(["easy", "medium", "hard"], {
      required_error: "Please select a difficulty level",
    }),
    mode: z.enum(["MCQs", "long_answer"], {
      required_error: "Please select a test mode",
    }),
  });



  export type QuickTestParams = z.infer<typeof quickTestSchema>;