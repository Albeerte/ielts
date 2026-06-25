import { Mic, Timer, Upload } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SpeakingPage() {
  const cards = [
    { title: "Part 1 interview", text: "Short personal questions with fluency tracking.", Icon: Mic },
    { title: "Part 2 cue card", text: "Preparation timer, two-minute answer, and audio upload.", Icon: Timer },
    { title: "Part 3 discussion", text: "Abstract follow-up questions with band criteria.", Icon: Upload },
  ];

  return (
    <AppShell>
      <PageHeading
        eyebrow="Speaking"
        title="Speaking practice and mock room"
        description="Part 1, cue cards, Part 3 discussion, full mock recording, teacher feedback, and AI feedback placeholder."
      />
      <section className="grid gap-5 lg:grid-cols-3">
        {cards.map(({ title, text, Icon }) => (
          <Card key={title}>
            <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
            <CardContent>
              <Icon className="mb-4 size-7 text-primary" />
              <p className="text-sm text-muted-foreground">{text}</p>
              <Button className="mt-4">Start recording</Button>
            </CardContent>
          </Card>
        ))}
      </section>
      <Card className="mt-5">
        <CardHeader><CardTitle>Band score criteria</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          {["Fluency and coherence", "Lexical resource", "Grammar range and accuracy", "Pronunciation"].map((item) => (
            <div key={item} className="rounded-2xl border border-border bg-background p-4 text-sm font-medium">{item}</div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
