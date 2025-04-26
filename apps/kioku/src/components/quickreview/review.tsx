"use client";
import { getAllRevision } from "@/app/actions/quick-review";
import { useUser } from "@clerk/nextjs";
import { memo, useEffect, useState } from "react";
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

export const ReviewList = memo(function ReviewList({
  reviewToLog,
  isSubTopic,
  showNotes,
}: any) {
  const { user } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subTopicRevision, setSubTopicRevision] = useState(null);
  const [activeTab, setActiveTab] = useState("topics");
  const [filterCategory, setFilterCategory] = useState("all");
  console.log("review list rendered");

  useEffect(() => {
    let isMounted = true;
    if (!user) return ;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await getAllRevision(user?.id || "");
        console.log(res);
        
        setData(res);

        const subtopic = res?.miniTopics.flatMap((subtopi) =>
          subtopi.review.map((test) =>
            test.testResult.map((q) => ({
              test: test.logId,
              category: subtopi.category,
              id: q.id,
              miniTopic: q.miniTopic,
              lastScore: q.lastScore,
              reviewDate: q.nextReviewDate,
            }))
          )
        );

        setSubTopicRevision(subtopic[0]);
      } catch (error) {
        console.error("Error fetching revision data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      fetchData();
    }
  }, [user]);

  // Filter categories function
  const filterItems = (items, category) => {
    if (!items) return [];
    if (category === "all") return items;
    return items.filter((item) => item.category === category);
  };

  // Get unique categories from data
  const getUniqueCategories = () => {
    const categories = new Set();

    if (data?.topics) {
      data.topics.forEach((item) => categories.add(item.category));
    }

    if (subTopicRevision) {
      subTopicRevision.forEach((item) => categories.add(item.category));
    }

    return Array.from(categories);
  };

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
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {getUniqueCategories().map((category) => (
                <SelectItem key={category} value={category}>
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
              {filterItems(data.topics, filterCategory).map((item, index) => (
                <ReviewCard
                  key={index}
                  item={item}
                  setReview={reviewToLog}
                  setNotesId={showNotes}
                />
              ))}
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
                (item, index) => (
                  <ReviewCard
                    key={index}
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
    </div>
  );
});
