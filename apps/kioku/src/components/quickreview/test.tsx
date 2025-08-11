import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { IconArrowBackUp, IconBrain, IconStar } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { IconHelp } from "@tabler/icons-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { IconBulb } from "@tabler/icons-react";
import { Input } from "../ui/input";
import { IconCircleCheck } from "@tabler/icons-react";
import { useState } from "react";
import { Answered } from "@repo/types";
import { Checkbox } from "../ui/checkbox";
import {
  check_test_result,
  get_a_test_result,
} from "@/app/actions/learning-log";
import { array } from "zod";

interface testDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  testData: any;
  mode: any;
}
//common types testdata , qustion is answer is changing so we can
export default function TestDialog({
  dialogOpen,
  setDialogOpen,
  testData,
  mode,
}: testDialogProps) {
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState<Answered[]>([]);
  const [answerRating, setAnswerRating] = useState("");
  const [checkResultDialogOpen, setCheckResultDialogOpen] = useState(false);
  const [checkResultData, setCheckResultData] = useState<any>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [isHintUsed, setIsHintUsed] = useState(false);
  const [isSetRating, setIsSetRating] = useState(false);
  const structure = testData?.structure;
  const testType = testData?.testType;
  const format = testData?.format;
  console.log("testData", testData);

  const allQuestions =
    structure?.subtopics?.flatMap((sub: any) => sub.questions) || [];

  const currentQuestion = allQuestions[currentIndex];
  const totalQuestions = allQuestions.length;
  console.log(currentQuestion);

  async function handleNextQuestion() {
    console.log({ currentIndex, totalQuestions });

    if (currentIndex <= totalQuestions - 1) {
      setAllAnswers((prevAnswers) => [
        ...prevAnswers,
        {
          question: currentQuestion?.question,
          answer: answer,
          subTopic: currentQuestion?.subTopic,
          rating: rating || 0,
          isHintUsed: isHintUsed,
        },
      ]);

      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      setAnswer("");
      setRating(null);
      setAnswerRating("");
      setShowHint(false);
      setCheckResultDialogOpen(false);
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

  async function checkTheAnswer() {
    console.log(
      "Checking answer:",
      currentQuestion?.question,
      answer,
      currentQuestion.answer,
      currentQuestion.correctAnswer
    );
    if (!answer.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await check_test_result({
        question: currentQuestion?.question,
        correctAnswer:
          currentQuestion?.answer || currentQuestion?.correctAnswer,
        userAnswer: answer,
      });

      console.log(res);
      const resultData = JSON.parse(res);
      handleNextQuestion();
      setCheckResultData(resultData);
      setCheckResultDialogOpen(true);
    } catch (error) {
      console.error("Error checking answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitTest() {
    console.log("Submitting test with answers:", allAnswers);

    try {
      const res = await get_a_test_result(testData.id, allAnswers);
      console.log("Test result submitted:", res);
    } catch (error) {
      console.error("Error submitting test result:", error);
    }
  }

  return (
    <div className="fixed w-full inset-0 z-50 flex flex-col items-center bg-white  gap-4">
      <div className="flex justify-between items-center w-full border-b border-gray-200 py-1 px-6 gap-10">
        <div
          onClick={() => setDialogOpen(false)}
          className="p-1 flex flex-row justify-between w-auto items-center cursor-pointer "
        >
          <IconArrowBackUp size={16} className="mr-2" />
          Exit
        </div>
        <p>Test</p>
        <div className="flex w-auto"></div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <div className="w-full shadow rounded-md p-6 ">
          {/* Question topic + finish btn  */}
          <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">
                {testType}
                <Badge className="ml-2" variant="outline">
                  {format === "long_answer" ? "Long Answer" : "Multiple Choice"}
                </Badge>
              </h1>
              <span>
                Question {currentIndex + 1} of {totalQuestions}
              </span>
            </div>
            <button>Finish Test</button>
          </div>

          {/* timelinke  */}
          <div className="w-full">
            <Progress
              value={((currentIndex + 1) / totalQuestions) * 100}
              className="h-2 mb-6"
            />
          </div>
        </div>
        <div className="flex justify-between items-center mb-4 gap-4">
          <div className="min-w-[32%] hidden md:block h-full p-2 shadow rounded-md ">
            <div className="grid grid-cols-5 gap-2">
              {allQuestions.map((question, index) => {
                return (
                  <div
                    key={index}
                    className={`w-full p-1 border rounded-md flex justify-center items-center ${currentIndex === index ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="">
            <Card className="py-0 border-none shadow ">
              <CardContent className="p-4">
                <p className="text-lg mb-2 ">{currentQuestion?.question}</p>

                <div className="space-y-4">
                  {/* Type of Answer */}
                  {format === "mcq" ? (
                    <MCQsQuestion
                      options={currentQuestion.options}
                      setAnswer={setAnswer}
                    />
                  ) : (
                    <LongQuestion answer={answer} setAnswer={setAnswer} />
                  )}

                  {showHint && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3 items-start">
                      <IconBulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
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
              <CardFooter className="border-t-2 border-gray-400 p-0 mx-4 py-2">
                <div className="flex w-full flex-wrap gap-3 mt-2 justify-between">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowHint(true)}
                      disabled={showHint}
                      className="flex gap-2"
                    >
                      <IconHelp className="h-4 w-4" />
                      Show Hint
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    {currentIndex !== totalQuestions - 1 ? (
                      <>
                        {isSetRating && (
                          <div className="flex items-center gap-2 border rounded-md px-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <IconStar
                                className="cursor-pointer"
                                key={i}
                                onClick={() => {
                                  setIsSetRating(false);
                                  setRating(i + 1);
                                  checkTheAnswer();
                                }}
                              />
                            ))}
                          </div>
                        )}
                        <Button
                          className="flex items-center gap-2 border rounded-md px-2 cursor-pointer"
                          disabled={isSetRating || isSubmitting}
                          onClick={() => {setIsSetRating(true)}}
                        >
                          <IconCircleCheck className="h-4 w-4" />
                          Answer
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => submitTest()}
                        className="flex gap-2"
                      >
                        <IconCircleCheck className="h-4 w-4" />
                        Submit Answer
                      </Button>
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function LongQuestion({ answer, setAnswer }: { answer: any; setAnswer: any }) {
  return (
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
  );
}

function MCQsQuestion({
  options,
  setAnswer,
}: {
  options: any;
  setAnswer: any;
}) {
  return (
    <div className="space-y-2 ">
      {options.map((opt, index) => (
        <label key={index} className="flex items-center space-x-2">
          <input
            type="radio"
            name="mcq-option"
            value={opt}
            onChange={() => setAnswer(opt)}
            className="accent-blue-600"
          />
          <span>{opt}</span>
        </label>
      ))}
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
