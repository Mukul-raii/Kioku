import { formatDate, getDueStatus } from "@/lib/date";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, ClipboardList } from "lucide-react";
import { BookOpen } from "lucide-react";
import { TabsContent } from "../ui/tabs";
import { memo, useState } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const ReviewCard = memo(function ReviewCard({
  item,
  showNotes,
  setReview,
  isSubtopic,
  setSubTopicId,
  setNotesId,
}: any) {
  const [reviewType, setReviewType] = useState(false);
  const [selectedType, setSelectedType] = useState("LONG");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Easy");
  function handleTopicReview(id: number, type: string, difficulty: string) {
    setReview(id, type, difficulty);
  }

  function handleSubTopicReview(id: number, test: number, type: string, difficulty: string) {
    setSubTopicId(id);
    setReview(test, type, difficulty);
  }
  console.log(isSubtopic, item);

  return (
    <>
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
                <span className="text-muted-foreground">Rating:{item.rating}</span>
              </div>
            )}
          </>
        </CardContent>

        <CardFooter>
          <Button
            onClick={() => {
              setReviewType(true);
            }}
            className="w-full"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Quick Review
          </Button>
        </CardFooter>
      </Card>
      {reviewType && (
        <Dialog open={reviewType} onOpenChange={setReviewType}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Choose Type and Difficulty</DialogTitle>
              <DialogDescription>
                Select the review type and difficulty level
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Review Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MCQ">Multiple Choice</SelectItem>
                    <SelectItem value="LONG">Long Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setReviewType(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (!isSubtopic) handleTopicReview(item.id,selectedType,selectedDifficulty);
                    else handleSubTopicReview(item.id, item.test,selectedType,selectedDifficulty);
                  }}
                  disabled={!selectedType || !selectedDifficulty}
                >
                  Start Review
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
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
