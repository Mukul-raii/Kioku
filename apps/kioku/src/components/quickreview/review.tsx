"use client";
import { getAllRevision } from "@/app/actions/quick-review";
import { createQuickTest } from "@/app/actions/quick-test";
import { useUser } from "@clerk/nextjs";
import { memo, useCallback, useEffect, useState } from "react";
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
import {
  GroupedNotes,
  quickTestSchema,
  SubTopicAggregate,
  TopicsForRevision,
} from "@repo/types";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export const ReviewList = memo(function ReviewList({
  reviewToLog,
  isSubTopic,
  showNotes,
}: any) {
  const { user } = useUser();
  const [data, setData] = useState<GroupedNotes>({
    message: "",
    topics: [],
    miniTopics: [],
  });
  const [loading, setLoading] = useState(true);
  const [subTopicRevision, setSubTopicRevision] = useState<SubTopicAggregate[]>(
    []
  );
  const [activeTab, setActiveTab] = useState("topics");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isQuickTest, setIsQuickTest] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof quickTestSchema>>({
    resolver: zodResolver(quickTestSchema),
    defaultValues: {
      category: "",
      topic: "",
    },
  });

  const onQuickTestSubmit = async (values: z.infer<typeof quickTestSchema>) => {
    try {
      setIsSubmitting(true);
      console.log("Creating quick test with:", values);

      const result = await createQuickTest(values);

      if (result.success) {
        console.log("Test created successfully:", result.data);
        setIsQuickTest(false);
        form.reset();
      }
    } catch (error) {
      console.error("Error creating quick test:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const isMounted = true;
    if (!user) return;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await getAllRevision(user?.id || "");
        console.log("data received ", res);

        if (isMounted) setData(res);

        const subtopic: SubTopicAggregate[] = res.miniTopics
          .flatMap(
            (subitem) =>
              // For each miniTopic, either flatten or return an empty array
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

        setSubTopicRevision(subtopic);
      } catch (error) {
        console.error("Error fetching revision data:", error);
      } finally {
        setLoading(false);
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (user?.id) {
      fetchData();
    }
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
                    setReview={reviewToLog}
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
                    setReview={reviewToLog}
                    setNotesId={showNotes}
                    isSubtopic={true}
                    setSubTopicId={isSubTopic}
                  />
                )
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

        <Dialog open={isQuickTest} onOpenChange={() => setIsQuickTest(false)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a Quick Test</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onQuickTestSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter topic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                              <SelectContent 
          className="z-[9999]"
          position="popper"
          side="bottom"
          align="start"
        >
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Mode</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select test mode" />
                          </SelectTrigger>
                        </FormControl>
                             <SelectContent 
          className="z-[9999]"
          position="popper"
          side="bottom"
          align="start"
        >
                          <SelectItem value="mcq">Multiple Choice</SelectItem>
                          <SelectItem value="long_answer">
                            Long Answer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsQuickTest(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Test"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
    </div>
  );
});
