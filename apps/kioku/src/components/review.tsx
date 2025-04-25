"use client";

import { getAllRevision } from "@/app/actions/quick-review";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  Tag,
  Filter,
  Clock,
  Brain,
  Star,
  CheckCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReviewList({
  reviewToLog,
  isSubTopic,
  showNotes,
}: {
  reviewToLog: number;
  isSubTopic: number;
  showNotes: (notes: string | null) => void;
}) {
  const { user } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subTopicRevision, setSubTopicRevision] = useState(null);
  const [activeTab, setActiveTab] = useState("topics");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getAllRevision(user?.id || "");
        setData(res);
        console.log(res);

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

  function setReviewId(index) {
    reviewToLog(index);
  }

  // Function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Get due status
  const getDueStatus = (dateString) => {
    try {
      const reviewDate = new Date(dateString);
      const today = new Date();

      // Set time to midnight for comparison
      reviewDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (reviewDate.getTime() === today.getTime()) return "Today";
      if (reviewDate.getTime() < today.getTime()) return "Overdue";

      // Calculate days difference
      const diffTime = Math.abs(reviewDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "Tomorrow";
      if (diffDays <= 7) return `In ${diffDays} days`;

      return formatDate(dateString);
    } catch (e) {
      return dateString;
    }
  };

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
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-28" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-7 w-3/4 mt-2" />
              </CardHeader>
              <CardContent className="pb-2">
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
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
          {!Array.isArray(data?.topics) ||
          filterItems(data.topics, filterCategory).length === 0 ? (
            <Card className="p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <ClipboardList className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                No revision topics yet
              </h2>
              <p className="text-muted-foreground mb-4">
                {filterCategory === "all"
                  ? "Start adding topics to review and they will appear here."
                  : `No topics found in the '${filterCategory}' category.`}
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filterItems(data.topics, filterCategory).map((item, index) => (
                <Card
                  key={index}
                  className="overflow-hidden transition-all hover:shadow-md"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="line-clamp-1">{item.topic}</span>
                      <Badge className={item.category}>{item.category}</Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDate(item.date)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Notes:</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => showNotes(item.notes)}
                        className="h-8 px-2"
                      >
                        View Notes
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Due:</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating:</span>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => setReviewId(item.id)}
                      className="w-full"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Quick Review
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="subtopics" className="space-y-6 my-10">
          {!Array.isArray(subTopicRevision) ||
          filterItems(subTopicRevision, filterCategory).length === 0 ? (
            <Card className="p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <ClipboardList className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                No revision subtopics yet
              </h2>
              <p className="text-muted-foreground mb-4">
                {filterCategory === "all"
                  ? "Start adding subtopics to review and they will appear here."
                  : `No subtopics found in the '${filterCategory}' category.`}
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filterItems(subTopicRevision, filterCategory).map(
                (item, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden transition-all hover:shadow-md"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="line-clamp-1">{item.miniTopic}</span>
                        <Badge className={item.category}>{item.category}</Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1 justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          Due: {getDueStatus(item.reviewDate)}
                        </div>
                        {item.lastScore && (
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 ${
                                  star <= item.lastScore
                                    ? "fill-primary text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>

                    <CardFooter>
                      <Button
                        onClick={() => {
                          isSubTopic(item.id);
                          setReviewId(item.test);
                        }}
                        className="w-full"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Quick Review
                      </Button>
                    </CardFooter>
                  </Card>
                )
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
