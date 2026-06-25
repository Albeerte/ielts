import { AppShell } from "@/components/app-shell";
import { BandScoreChart } from "@/components/band-score-chart";
import { MetricCard } from "@/components/metric-card";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { dailyTasks, recentActivity, skillProgress, students } from "@/lib/sample-data";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Student dashboard"
        title="Your IELTS command center"
        description="Track band scores, daily tasks, weak skills, upcoming mocks, vocabulary, streaks, and teacher feedback."
      />
      <section className="metric-grid mb-5">
        <MetricCard label="Overall band" value="6.8" helper="toward target 7.5" trend={0.4} />
        <MetricCard label="Study streak" value="18 days" helper="daily practice active" trend={3} />
        <MetricCard label="Vocabulary" value="72%" helper="SRS mastery" trend={8} />
        <MetricCard label="Weak skills" value="2" helper="Listening, Writing" trend={-1} />
      </section>
      <section className="page-grid">
        <Card>
          <CardHeader>
            <CardTitle>IELTS score progress</CardTitle>
          </CardHeader>
          <CardContent>
            <BandScoreChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily tasks</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {dailyTasks.map((task, index) => (
              <div key={task} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{task}</span>
                  <span className="text-sm text-muted-foreground">{index + 1}/4</span>
                </div>
                <Progress value={index < 2 ? 100 : 45} className="mt-3" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {recentActivity.map((item) => (
              <div key={item} className="rounded-xl border border-border bg-background px-4 py-3 text-sm">{item}</div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Teacher feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-950 dark:bg-indigo-950 dark:text-indigo-100">
              Your Task 2 body paragraphs are clearer. Next lesson: improve concession sentences and topic-specific collocations.
            </div>
            <div className="mt-4 text-sm text-muted-foreground">Private lessons assigned: {students[0].privateLessons}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {skillProgress.map((skill) => <span key={skill.label} className="rounded-full bg-muted px-2.5 py-1 text-xs">{skill.label} {skill.score}</span>)}
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
