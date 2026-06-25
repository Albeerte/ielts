"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const defaultHtml = `<article class="reading-task">
  <h2>The Future of Artificial Intelligence in Education</h2>
  <p><strong>A</strong> Artificial intelligence is changing how students practise and receive feedback.</p>
  <section data-question-block="1">
    <label>1. AI can support feedback. <input type="text" data-question="1" name="1" /></label>
  </section>
</article>`;

function sanitizePreview(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/javascript:/gi, "");
}

export function HtmlBuilder() {
  const [title, setTitle] = useState("Reading Part 1: AI in Education");
  const [section, setSection] = useState("Part 1");
  const [html, setHtml] = useState(defaultHtml);
  const [answerKey, setAnswerKey] = useState('{"1":"TRUE"}');
  const [explanations, setExplanations] = useState('{"1":"Paragraph A says AI supports feedback."}');
  const safeHtml = useMemo(() => sanitizePreview(html), [html]);

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>HTML Reading Builder</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Test title
            <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Section type
            <Input value={section} onChange={(event) => setSection(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            HTML passage and questions
            <Textarea className="min-h-64 font-mono text-xs" value={html} onChange={(event) => setHtml(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Answer key JSON
            <Textarea className="font-mono text-xs" value={answerKey} onChange={(event) => setAnswerKey(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Explanations JSON
            <Textarea className="font-mono text-xs" value={explanations} onChange={(event) => setExplanations(event.target.value)} />
          </label>
          <div className="flex gap-2">
            <Button>Save draft</Button>
            <Button variant="outline">Publish</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Safe preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-xl border border-border bg-muted/40 p-4">
            <div className="text-sm text-muted-foreground">{section}</div>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          <div
            className="prose prose-slate max-w-none rounded-xl border border-border bg-background p-5 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
