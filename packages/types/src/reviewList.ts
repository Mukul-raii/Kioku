import { GroupedNotes, SubTopicAggregate } from "./notes.types";

export interface ReviewListState {
  // Data
  data: GroupedNotes;
  subTopicRevision: SubTopicAggregate[];
  
  // UI State
  loading: boolean;
  activeTab: string;
  filterCategory: string;
  
  // Test State
  reviewToLog: number;
  isSubTopic: number;
  allQuestionsData: any;
  testData: any;
  isDialogOpen: boolean;
  isQuickTest: boolean;
}

export type ReviewListAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: GroupedNotes }
  | { type: 'SET_SUBTOPIC_REVISION'; payload: SubTopicAggregate[] }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_FILTER_CATEGORY'; payload: string }
  | { type: 'SET_REVIEW_TO_LOG'; payload: number }
  | { type: 'SET_IS_SUBTOPIC'; payload: number }
  | { type: 'SET_TEST_DATA'; payload: { testData: any; questionsData: any } }
  | { type: 'SET_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_QUICK_TEST'; payload: boolean }
  | { type: 'RESET_TEST_STATE' };