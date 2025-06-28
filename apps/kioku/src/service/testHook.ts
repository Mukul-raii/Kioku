import { ReviewListAction, ReviewListState } from "@repo/types";
import { useReducedMotion } from "framer-motion";

export const initialReviewListState: ReviewListState = {
  data: {
    message: "",
    topics: [],
    miniTopics: [],
  },
  subTopicRevision: [],
  loading: true,
  activeTab: "topics",
  filterCategory: "all",
  reviewToLog: 0,
  reviewType: "Long",
  reviewDifficulty: "Easy",
  isSubTopic: 0,
  allQuestionsData: null,
  testData: null,
  isDialogOpen: false,
  isQuickTest: false,
};

export const reviewListReducers = (
  state: ReviewListState,
  action: ReviewListAction
): ReviewListState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_DATA":
      return { ...state, data: action.payload };

    case "SET_SUBTOPIC_REVISION":
      return { ...state, subTopicRevision: action.payload };

    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };

    case "SET_FILTER_CATEGORY":
      return { ...state, filterCategory: action.payload };

    case "SET_REVIEW_TO_LOG":
      return { ...state, reviewToLog: action.payload };

    case "SET_REVIEW_TYPE":
      return { ...state, reviewType: action.payload };
    case "SET_REVIEW_DIFFICULTY":
      return { ...state, reviewDifficulty: action.payload };

    case "SET_IS_SUBTOPIC":
      return { ...state, isSubTopic: action.payload };

    case "SET_TEST_DATA":
      return {
        ...state,
        testData: action.payload.testData,
        allQuestionsData: action.payload.questionsData,
        isDialogOpen: true,
      };

    case "SET_DIALOG_OPEN":
      return { ...state, isDialogOpen: action.payload };

    case "SET_QUICK_TEST":
      return { ...state, isQuickTest: action.payload };

    case "RESET_TEST_STATE":
      return {
        ...state,
        reviewToLog: 0,
        reviewType: "Long",
        reviewDifficulty: "Easy",
        isSubTopic: 0,
        allQuestionsData: null,
        testData: null,
        isDialogOpen: false,
      };

    default:
      return state;
  }
};
