import { formatDate, getDueStatus } from "@/lib/date";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, ClipboardList } from "lucide-react";
import { BookOpen } from "lucide-react";
import { TabsContent } from "../ui/tabs";
import { memo } from "react";

export const ReviewCard = memo(function ReviewCard({
  item,
  showNotes,
  setReview,
  isSubtopic,
  setSubTopicId,
  setNotesId,
}: any) {
  function handleTopicReview(id: number) {
    console.log('set id ',id);
    setReview(id);

  }

  function handleSubTopicReview(id: number, test) {
    console.log({ id, test });
    setSubTopicId(id);
    setReview(test);
  }
  console.log(isSubtopic, item);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="line-clamp-1">
            {!isSubtopic ? item.topic : item.miniTopic}
          </span>
          <Badge className={item.category}>{item.category}</Badge>
        </CardTitle>
        <CardDescription className="flex items-center mt-1">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          {formatDate(item.date || item.reviewDate)}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Due:</span>
            <span>{getDueStatus(isSubtopic ? item.dueDate : item.date)}</span>
          </div>
          {isSubtopic && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rating:</span>
            </div>
          )}
        </>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => {
            if (!isSubtopic) handleTopicReview(item.id);
            else handleSubTopicReview(item.id, item.test);
          }}
          className="w-full"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Quick Review
        </Button>
      </CardFooter>
    </Card>
  );
});

export const NoDataCard = memo(function NoDataCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <Card className="p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
        <ClipboardList className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-4">{message}</p>
    </Card>
  );
});
