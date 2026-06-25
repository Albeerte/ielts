import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analytics, teachers, tests } from "@/lib/sample-data";

export default function AdminDashboardPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="Admin Panel" title="Platform control center" description="Manage students, teachers, tests, subscriptions, articles, podcasts, dictations, vocabulary, and analytics." />
      <section className="metric-grid mb-5">
        <MetricCard label="Active users" value={analytics.activeUsers.toLocaleString()} helper="students and teachers" />
        <MetricCard label="Completed tests" value={analytics.completedTests.toLocaleString()} helper="all-time" />
        <MetricCard label="Average band" value={String(analytics.averageBand)} helper="platform average" />
        <MetricCard label="Subscriptions" value={String(analytics.subscriptionsActive)} helper="active access" />
      </section>
      <section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Manage content</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {["IELTS tests", "Articles", "Podcasts", "Dictations", "Vocabulary", "Mock tests"].map((item) => (
              <div key={item} className="rounded-xl border border-border bg-background p-4">{item}</div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Teachers and tests</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {teachers.map((teacher) => <div key={teacher.id} className="text-sm">{teacher.name} · {teacher.activeStudents} students</div>)}
            <div className="border-t border-border pt-3 text-sm text-muted-foreground">{tests.length} tests in library</div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
