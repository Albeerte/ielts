import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { students, teachers } from "@/lib/sample-data";

export default function TeacherProfilePage() {
  const teacher = teachers[0];

  return (
    <AppShell>
      <PageHeading eyebrow="Teacher Profile" title={teacher.name} description="Students, progress, private tasks, group assignments, feedback queue, lessons, and recommendations." />
      <section className="page-grid">
        <Card>
          <CardHeader><CardTitle>Teacher dashboard</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <div>Specialization: <strong>{teacher.specialization}</strong></div>
            <div>Active students: <strong>{teacher.activeStudents}</strong></div>
            <div>Pending reviews: <strong>{teacher.pendingReviews}</strong></div>
            <Button>Create private task</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Student list</CardTitle></CardHeader>
          <CardContent className="grid gap-3">{students.map((student) => <div key={student.id} className="rounded-xl border border-border bg-background p-4">{student.name} · Band target {student.targetBand}</div>)}</CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
