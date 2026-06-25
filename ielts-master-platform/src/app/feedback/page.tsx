import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeedbackPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="Teacher Feedback" title="Feedback center" description="Reading, Listening, Speaking, and Writing feedback with band criteria and recommendations." />
      <section className="grid gap-4 lg:grid-cols-2">
        {["Writing Task 2", "Speaking Part 2", "Reading Passage 3", "Listening Part 4"].map((title) => (
          <Card key={title}>
            <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Strong idea development. Next recommendation: use more precise topic vocabulary and review your common grammar mistakes.
            </CardContent>
          </Card>
        ))}
      </section>
    </AppShell>
  );
}
