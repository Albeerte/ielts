import { AppShell } from "@/components/app-shell";
import { BandScoreChart } from "@/components/band-score-chart";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recentActivity } from "@/lib/sample-data";

export default function ProgressPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="My Progress" title="Band score reporting" description="Progress logs, streaks, weak skill detection, completed tests, and mistake trends." />
      <section className="page-grid">
        <Card><CardHeader><CardTitle>Skill chart</CardTitle></CardHeader><CardContent><BandScoreChart /></CardContent></Card>
        <Card>
          <CardHeader><CardTitle>Mistake history</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {["Article matching headings", "Listening plural endings", "Task 2 cohesion", "Speaking Part 3 examples"].map((item) => (
              <div key={item} className="rounded-xl border border-border bg-background p-4 text-sm">{item}</div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Completed tests</CardTitle></CardHeader>
          <CardContent className="grid gap-3">{recentActivity.map((item) => <div key={item} className="text-sm text-muted-foreground">{item}</div>)}</CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
