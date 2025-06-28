import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { BrainCircuit } from "lucide-react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { HelpCircle } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Lightbulb } from "lucide-react";
import { Input } from "../ui/input";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Answered } from "@repo/types";
import { Checkbox } from "../ui/checkbox";
import { check_test_result } from "@/app/actions/learning-log";

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
  const structure = testData?.structure;
  const testType = testData?.testType;
  const format = testData?.format;

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
      const res = await checkTheAnswer();
      console.log(res);
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
    if (!answer.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await check_test_result({
        question: currentQuestion?.question ,
        correctAnswer: currentQuestion?.answer ||currentQuestion?.correctAnswer,
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

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BrainCircuit className="h-5 w-5" />
            {structure?.topic}
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
                  onClick={() => checkTheAnswer()}
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
