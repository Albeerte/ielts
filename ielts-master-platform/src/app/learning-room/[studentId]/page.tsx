import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { students, vocabulary } from "@/lib/sample-data";

export default async function LearningRoomPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const student = students.find((item) => item.id === studentId) ?? students[0];

  return (
    <AppShell>
      <PageHeading eyebrow="Individual Learning Room" title={`${student.name}'s private room`} description="Assign private lessons, tests, homework, teacher notes, weak-area tracking, and personal recommendations." />
      <section className="page-grid">
        <Card>
          <CardHeader><CardTitle>Teacher actions</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {["Assign private lesson", "Assign private test", "Write personal note", "Give homework", "Recommend article or podcast"].map((action) => (
              <Button key={action} variant="outline">{action}</Button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Weak areas and recommendations</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <div>Weak skills: <strong>{student.weakSkills.join(", ")}</strong></div>
            <div>Recommended vocabulary: {vocabulary.map((word) => word.word).join(", ")}</div>
            <div className="rounded-2xl bg-muted p-4 text-sm">Teacher note: focus on listening distractors and writing coherence this week.</div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
