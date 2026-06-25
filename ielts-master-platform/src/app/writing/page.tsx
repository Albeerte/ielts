import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function WritingPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Writing"
        title="Writing Task 1 and Task 2"
        description="Timed writing prompts, word counter, autosaved drafts, teacher feedback, model answers, and band criteria."
      />
      <section className="page-grid">
        <Card>
          <CardHeader><CardTitle>Task 2 Essay</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">Some people think technology makes education more effective. To what extent do you agree or disagree?</p>
            <Textarea className="min-h-80" placeholder="Write your essay here..." />
            <div className="mt-3 flex justify-between text-sm text-muted-foreground">
              <span>Word counter: 0 / 250</span>
              <span>Auto-save enabled</span>
            </div>
            <Button className="mt-4">Submit writing</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Band criteria</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {["Task achievement / response", "Coherence and cohesion", "Lexical resource", "Grammatical range and accuracy"].map((item) => (
              <div key={item} className="rounded-2xl border border-border bg-background p-4">{item}</div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
