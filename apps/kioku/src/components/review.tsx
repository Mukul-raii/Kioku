"use client";

import { getAllRevision } from "@/app/actions/quick-review";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { BookOpen, Calendar, ClipboardList, Tag } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

export default function ReviewList({
  reviewToLog,
  isSubTopic,
}: {
  reviewToLog: number;
  isSubTopic: number;
}) {
  const { user } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subTopicRevision, setSubTopicRevision] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getAllRevision(user?.id || "");
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
        console.log(subtopic);
      } catch (error) {
        console.error("Error fetching revision data:", error);
      } finally {
        setLoading(false);
      }
    }
    console.log(subTopicRevision);

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

  // Get category color
  const getCategoryColor = (category) => {
    const categories = {
      Math: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      Science: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      History:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      Language:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Computer Science":
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };

    return (
      categories[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-7 w-3/4" />
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Your Revision Topics
        </h1>
        <Badge variant="outline" className="px-3 py-1">
          {Array.isArray(data?.topics) ? data.topics.length : 0} Topics
        </Badge>
      </div>

      {!Array.isArray(data?.topics) || data.topics.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <ClipboardList className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No revision topics yet</h2>
          <p className="text-muted-foreground mb-4">
            Start adding topics to review and they will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.topics.map((item, index) => (
            <Card
              key={index}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-1">
                  <Badge className={`${getCategoryColor(item.category)}`}>
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    {item.category}
                  </Badge>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {formatDate(item.date)}
                  </div>
                </div>
                <CardTitle className="line-clamp-1 text-lg">
                  {item.topic}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {item.notes || "No notes available"}
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  onClick={() => setReviewId(item.id)}
                  className="w-full"
                  size="sm"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Quick Review
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Your Revision Sub-Topics
          </h1>
          <Badge variant="outline" className="px-3 py-1">
            {Array.isArray(subTopicRevision) ? subTopicRevision.length : 0} Sub
            Topics
          </Badge>
        </div>

        {!Array.isArray(subTopicRevision) || subTopicRevision.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <ClipboardList className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              No revision miniTopics yet
            </h2>
            <p className="text-muted-foreground mb-4">
              Start adding miniTopics to review and they will appear here.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subTopicRevision.map((item, index) => (
              <Card
                key={index}
                className="overflow-hidden transition-all hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-1">
                    <Badge className={`${getCategoryColor(item.category)}`}>
                      <Tag className="h-3.5 w-3.5 mr-1" />
                      {item.category}
                    </Badge>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDate(item.reviewDate)}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-1 text-lg">
                    {item.miniTopic}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {item.notes || "No notes available"}
                  </p>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button
                    onClick={() => {
                      isSubTopic(item.id);
                      setReviewId(item.test);
                    }}
                    className="w-full"
                    size="sm"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Quick Review
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
