"use client";

import { useMemo, useState } from "react";
import { Clock, Flag, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const questions = Array.from({ length: 10 }, (_, index) => index + 1);

export function PracticeRunner() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [review, setReview] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;
  const percent = useMemo(() => (answered / questions.length) * 100, [answered]);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>AI in Education</span>
            <span className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="size-4" /> 19:42</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none dark:prose-invert">
          <p><strong>A</strong> Artificial intelligence is becoming a familiar presence in education. Software can recommend exercises, check simple answers, and identify topics students may need to review.</p>
          <p><strong>B</strong> Adaptive learning platforms change the level and order of activities according to learner performance.</p>
          <p><strong>C</strong> Teachers remain essential because they notice motivation, confidence, and emotional needs.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Answer sheet</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Progress value={percent} />
          <div className="grid grid-cols-5 gap-2">
            {questions.map((question) => (
              <button
                key={question}
                className={`rounded-xl border p-3 text-sm font-semibold transition ${
                  answers[question]
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950"
                    : review.includes(question)
                      ? "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950"
                      : "border-border bg-background"
                }`}
                onClick={() => setAnswers((current) => ({ ...current, [question]: `Answer ${question}` }))}
              >
                {question}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setReview((current) => current.includes(1) ? current.filter((item) => item !== 1) : [...current, 1])}>
              <Flag /> Mark Q1
            </Button>
            <Button onClick={() => setSubmitted(true)}>
              <Send /> Submit test
            </Button>
          </div>
          {submitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
              Submitted. Answered {answered}/{questions.length}. Review marked: {review.length}. Mistake analysis and explanations are ready.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
