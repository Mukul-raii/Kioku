"use client";
import { getAllRevision } from "@/app/actions/quick-review";
import { useUser } from "@clerk/nextjs";
import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Clock, Brain } from "lucide-react";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReviewListLoader } from "./reviewLIstLoader";
import { ReviewCard, NoDataCard } from "./reviewCard";
import { SubTopicAggregate, TopicsForRevision } from "@repo/types";
import { Button } from "../ui/button";
import { get_a_test } from "@/app/actions/learning-log";
import TestDialog from "./test";
import QuickTestForm from "./quicktesForm";
import { initialReviewListState, reviewListReducers } from "@/service/testHook";

export const ReviewList = memo(function ReviewList({ showNotes }: any) {
  const { user } = useUser();
  const [state, dispatch] = useReducer(
    reviewListReducers,
    initialReviewListState
  );
  const {
    data,
    subTopicRevision,
    loading,
    activeTab,
    filterCategory,
    reviewToLog,
    isSubTopic,
    reviewType,
    reviewDifficulty,
    allQuestionsData,
    testData,
    isDialogOpen,
    isQuickTest,
  } = state;

  const setActiveTab = useCallback((tab: string) => {
    dispatch({ type: "SET_ACTIVE_TAB", payload: tab });
  }, []);

  const setFilterCategory = useCallback((category: string) => {
    dispatch({ type: "SET_FILTER_CATEGORY", payload: category });
  }, []);

  const setReviewToLog = useCallback(
    (id: number, mode: string, difficulty: string) => {
      dispatch({ type: "SET_REVIEW_TO_LOG", payload: id });
      dispatch({ type: "SET_REVIEW_TYPE", payload: mode });
      dispatch({ type: "SET_REVIEW_DIFFICULTY", payload: difficulty });
      dispatch({ type: "SET_DIALOG_OPEN", payload: true });
    },
    []
  );

  const setIsQuickTest = useCallback((open: boolean) => {
    dispatch({ type: "SET_QUICK_TEST", payload: open });
  }, []);

  useEffect(() => {
    console.log("fetching test data");
    if (!reviewToLog) return;
    async function fetchTestData() {
      try {
        const res = await get_a_test(reviewToLog, isSubTopic, reviewType, reviewDifficulty);
        const data = JSON.parse(res);
        dispatch({
          type: "SET_TEST_DATA",
          payload: {
            testData: data.outputStructure,
            questionsData: data.questions,
          },
        });
      } catch (error) {
        console.error(`Failed to fetch test data`, error);
      }
    }
    fetchTestData();
  }, [reviewToLog, isSubTopic]);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchData() {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const res = await getAllRevision(user?.id || "");

        dispatch({ type: "SET_DATA", payload: res });

        const subtopic: SubTopicAggregate[] = res.miniTopics
          .flatMap(
            (subitem) =>
              subitem.review?.flatMap((test) =>
                test.testResult?.map((q) => ({
                  test: test.logId,
                  category: subitem.category,
                  id: q.id,
                  miniTopic: q.miniTopic,
                  lastScore: q.lastScore,
                  reviewDate: q.nextReviewDate,
                }))
              ) ?? []
          )
          .filter((item): item is SubTopicAggregate => item !== undefined);
        dispatch({ type: "SET_SUBTOPIC_REVISION", payload: subtopic });
      } catch (error) {
        console.error("Error fetching revision data:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }
    fetchData();
  }, [user]);

  // Filter categories function
  const filterItems = useCallback(
    <T extends { category: string }>(
      items: T[] | undefined,
      category: string
    ): T[] => {
      if (!items) return [];
      if (category === "all") return items;
      return items.filter((item) => item.category === category);
    },
    []
  );

  // Get unique categories from data
  const getUniqueCategories = useCallback(() => {
    const categories = new Set<string>();

    if (data?.topics) {
      data.topics.forEach((item) => categories.add(item.category));
    }

    if (subTopicRevision) {
      subTopicRevision?.forEach((item) => categories.add(item.category));
    }

    return Array.from(categories);
  }, [data?.topics, subTopicRevision]);

  if (loading) {
    return <ReviewListLoader />;
  }

  // Count topics and subtopics for the active tab
  const topicsCount = Array.isArray(data?.topics)
    ? filterItems(data.topics, filterCategory).length
    : 0;

  const subtopicsCount = Array.isArray(subTopicRevision)
    ? filterItems(subTopicRevision, filterCategory).length
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Revision</h1>
        <div className="flex items-center gap-2">
          <Button variant="default" onClick={() => setIsQuickTest(true)}>
            Start a quick test
          </Button>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {getUniqueCategories().map((category: string, index: number) => (
                <SelectItem key={index} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs
        defaultValue="topics"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="topics" className="flex gap-2">
            <Clock className="h-4 w-4" />
            <span>Topics</span>
            <Badge variant="secondary" className="ml-auto">
              {topicsCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="subtopics" className="flex gap-2">
            <Brain className="h-4 w-4" />
            <span>Sub-Topics</span>
            <Badge variant="secondary" className="ml-auto">
              {subtopicsCount}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="topics" className="space-y-6 my-10">
          {topicsCount === 0 ? (
            <NoDataCard
              title="No revision topics yet"
              message="Start adding topics to review and they will appear here."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filterItems(data.topics, filterCategory).map(
                (item: TopicsForRevision) => (
                  <ReviewCard
                    key={item.id}
                    item={item}
                    setReview={setReviewToLog}
                    setNotesId={showNotes}
                  />
                )
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="subtopics" className="space-y-6 my-10">
          {subtopicsCount === 0 ? (
            <NoDataCard
              title="No revision topics yet"
              message="Start adding topics to review and they will appear here."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filterItems(subTopicRevision, filterCategory).map(
                (item: SubTopicAggregate) => (
                  <ReviewCard
                    key={item.id}
                    item={item}
                    setReview={setReviewToLog}
                    setNotesId={showNotes}
                    isSubtopic={true}
                    setSubTopicId={(value: number) =>
                      dispatch({ type: "SET_IS_SUBTOPIC", payload: value })
                    }
                  />
                )
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
      {
        <QuickTestForm
          open={isQuickTest}
          onChange={setIsQuickTest}
          setQuickTest={() =>
            dispatch({ type: "SET_QUICK_TEST", payload: true })
          }
        />
      }
      {isDialogOpen && testData && (
        <Suspense fallback={<div>Loading....</div>}>
          <TestDialog
            dialogOpen={isDialogOpen}
            setDialogOpen={() =>
              dispatch({ type: "SET_DIALOG_OPEN", payload: false })
            }
            testData={testData}
            mode={"quick"}
          />
        </Suspense>
      )}
    </div>
  );
});
