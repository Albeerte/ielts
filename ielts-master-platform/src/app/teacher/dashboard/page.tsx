import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { students, tests, teachers } from "@/lib/sample-data";

export default function TeacherDashboardPage() {
  const teacher = teachers[0];

  return (
    <AppShell>
      <PageHeading
        eyebrow="Teacher dashboard"
        title={`Welcome, ${teacher.name}`}
        description="Create private tasks, group assignments, upload lessons, check submissions, assign mocks, and send recommendations."
        action={<Button asChild><Link href="/test-builder">Create test</Link></Button>}
      />
      <section className="metric-grid mb-5">
        <MetricCard label="Active students" value={String(teacher.activeStudents)} helper="assigned to you" />
        <MetricCard label="Pending reviews" value={String(teacher.pendingReviews)} helper="writing/speaking queue" />
        <MetricCard label="Group tasks" value="7" helper="active assignments" />
        <MetricCard label="Mock tests" value="4" helper="scheduled this week" />
      </section>
      <section className="page-grid">
        <Card>
          <CardHeader><CardTitle>Student progress</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
                <div>
                  <div className="font-semibold">{student.name}</div>
                  <div className="text-sm text-muted-foreground">Weak: {student.weakSkills.join(", ")}</div>
                </div>
                <Button variant="outline" asChild><Link href={`/learning-room/${student.id}`}>Room</Link></Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Content you can assign</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {tests.slice(0, 5).map((test) => (
              <div key={test.id} className="rounded-xl border border-border bg-background p-4 text-sm">
                <strong>{test.title}</strong>
                <div className="text-muted-foreground">{test.skill} · {test.section}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
