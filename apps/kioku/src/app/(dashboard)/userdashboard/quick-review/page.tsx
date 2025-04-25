"use client";
import { useEffect, useState } from "react";
import ReviewList from "@/components/review";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  check_test_result,
  get_a_test,
  get_a_test_result,
  get_a_test_result_sub_topic,
} from "@/app/actions/learning-log";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Answered } from "@repo/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import TailwindAdvancedEditor from "@/components/textEditor";

export default function QuickReview() {
  const [logReview, setLogReview] = useState(null);
  const [testData, setTestData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allQuestions, setAllQuestions] = useState(null);
  const [isHint, setIsHint] = useState(false);
  const [allAnswers, setAllAnswers] = useState<Answered[]>([]);
  const [checkResultDialogOpen, setCheckResultDialogOpen] = useState(false);
  const [checkResultData, setCheckResultData] = useState(null);
  const [answerRating, setAnswerRating] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [answer, setAnswer] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubtopic, setISSubTopic] = useState(0);
  const [showNotesId, setShowNotesId] = useState<string | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const handleShowNotes = (notes: string | null) => {
    setShowNotesId(notes);
    setIsNotesOpen(true);
  };

  useEffect(() => {
    if (logReview === null) return;
    async function getTestData() {
      try {
        const res = await get_a_test(logReview, isSubtopic);
        const data = JSON.parse(res);

        setAllQuestions(
          data?.subtopics?.flatMap((sub) =>
            sub.questions.map((q) => ({
              ...q,
              subTopic: sub.name,
            }))
          )
        );

        setTestData(data);
        setDialogOpen(true);
      } catch (error) {
        console.error(error);
      }
    }
    getTestData();
  }, [logReview]);

  const currentQuestion = allQuestions && allQuestions[currentIndex];
  const totalQuestions = allQuestions?.length || 0;

  async function getResult() {
    if (isSubtopic === 0) {
      const res = await get_a_test_result(logReview, allAnswers);
      console.log(res);
    } else {
      console.log(logReview, allAnswers);

      const res = await get_a_test_result_sub_topic(isSubtopic, allAnswers);
      console.log(res);
    }
  }

  async function checkTheAnswer() {
    if (!answer.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await check_test_result({
        question: currentQuestion?.question || "",
        correctAnswer: currentQuestion?.answer || "",
        userAnswer: answer,
      });

      const resultData = JSON.parse(res);
      setCheckResultData(resultData);
      setCheckResultDialogOpen(true);
    } catch (error) {
      console.error("Error checking answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNextQuestion() {
    console.log({ currentIndex, totalQuestions });

    if (currentIndex <= totalQuestions - 1) {
      setAllAnswers((prevAnswers) => [
        ...prevAnswers,
        {
          question: currentQuestion?.question,
          answer: answer,
          subTopic: currentQuestion?.subTopic,
          rating: parseInt(answerRating),
          isHintUsed: isHint,
        },
      ]);

      setCurrentIndex(currentIndex + 1);
      setAnswer("");
      setAnswerRating("");
      setShowHint(false);
      setCheckResultDialogOpen(false);
    }
    if (currentIndex > totalQuestions - 1) {
      const res = getResult();
    }
  }

  function handlePreviousQuestion() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setAnswer("");
      setShowHint(false);
      setCheckResultDialogOpen(false);
    }
  }

  function getResultColor(rate) {
    if (rate === 3) return "text-green-600";
    if (rate === 2) return "text-amber-600";
    return "text-red-600";
  }

  function getResultIcon(rate) {
    if (rate === 3) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (rate === 2) return <AlertCircle className="h-5 w-5 text-amber-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <ReviewList
        reviewToLog={setLogReview}
        isSubTopic={setISSubTopic}
        showNotes={handleShowNotes}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <BrainCircuit className="h-5 w-5" />
              {testData?.topic}
            </DialogTitle>
            <DialogDescription>
              Test your knowledge with these questions
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
              <span>
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <Badge variant="outline">{currentQuestion?.subTopic}</Badge>
            </div>
            <Progress
              value={((currentIndex + 1) / totalQuestions) * 100}
              className="h-2 mb-6"
            />

            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4 leading-relaxed">
                  {currentQuestion?.question}
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="answer" className="text-base">
                      Your Answer
                    </Label>
                    <Input
                      id="answer"
                      value={answer}
                      placeholder="Type your answer here..."
                      onChange={(e) => setAnswer(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  {showHint && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3 items-start">
                      <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div onClick={() => setIsHint(true)}>
                        <p className="font-medium text-amber-800 dark:text-amber-400 mb-1">
                          Hint
                        </p>
                        <p className="text-amber-700 dark:text-amber-300">
                          {currentQuestion?.hint || "No hint available"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3 justify-between">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowHint(true)}
                  disabled={showHint}
                  className="flex gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  Show Hint
                </Button>
                {
                  <Button
                    variant="outline"
                    onClick={() => getResult()}
                    disabled={showHint}
                    className="flex gap-2"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Submit Answer
                  </Button>
                }
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={checkTheAnswer}
                  disabled={!answer.trim() || isSubmitting}
                  className="flex gap-2"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Check Answer
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {checkResultData ? (
        <Dialog
          open={checkResultDialogOpen}
          onOpenChange={setCheckResultDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getResultIcon(checkResultData?.rate)}
                Answer Evaluation
              </DialogTitle>
              <DialogDescription>
                Here's how you did on this question
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Result:</span>
                  <Badge
                    className={cn(
                      "px-3 py-1",
                      checkResultData?.rate === 3
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : checkResultData?.rate === 2
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    )}
                  >
                    {checkResultData?.rate === 3
                      ? "Correct"
                      : checkResultData?.rate === 2
                        ? "Almost Correct"
                        : "Incorrect"}
                  </Badge>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="font-medium mb-1">Feedback:</p>
                  <p className="text-muted-foreground">
                    {checkResultData?.summary}
                  </p>
                </div>
              </div>

              {checkResultData?.rate >= 2 && (
                <div className="space-y-3">
                  <p className="font-medium">How well did you know this?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(rateYourSelf).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`rate-${key}`}
                          checked={answerRating === key}
                          onCheckedChange={() => setAnswerRating(key)}
                        />
                        <label
                          htmlFor={`rate-${key}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {value}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setCheckResultDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setCheckResultDialogOpen(false);
                  handleNextQuestion();
                }}
                className="flex gap-2"
              >
                Next Question
                <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}

      {showNotesId !== null && (
        <Dialog
          open={isNotesOpen}
          onOpenChange={(open) => {
            setIsNotesOpen(open);
            if (!open) setShowNotesId(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notes</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Here are the notes for this question:
            </DialogDescription>
            <ScrollArea className="h-64 w-full">
              <TailwindAdvancedEditor
                value={showNotesId}
                onChange={(e) => {
                  console.log("changed", e);
                }}
              />
            </ScrollArea>
            <DialogFooter>
              <Button
                onClick={() => {
                  setIsNotesOpen(false);
                  setShowNotesId(null);
                  const content =
                    window.localStorage.removeItem("novel-content");
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

const rateYourSelf = {
  "5": "Question was too easy for you",
  "4": "Like pressure to remember",
  "3": "Put a lot pressure to remember",
  "2": "Took a hint to remember",
  "1": "Remember a bit",
  "0": "Forgot everything",
};
