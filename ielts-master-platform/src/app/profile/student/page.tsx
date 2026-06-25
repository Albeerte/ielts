import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { students, vocabulary } from "@/lib/sample-data";

export default function StudentProfilePage() {
  const student = students[0];

  return (
    <AppShell>
      <PageHeading eyebrow="Student Profile" title={student.name} description="Personal information, target band, study plan, completed tests, saved vocabulary, mistakes, and private lessons." />
      <section className="page-grid">
        <Card>
          <CardHeader><CardTitle>Study profile</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div>Target band: <strong>{student.targetBand}</strong></div>
            <div>Current level: <strong>{student.currentLevel}</strong></div>
            <div>Streak: <strong>{student.streak} days</strong></div>
            <Progress value={student.vocabularyProgress} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Private lessons</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {["Essay structure correction", "Listening map labelling", "Speaking Part 3 examples"].map((lesson) => (
              <div key={lesson} className="rounded-xl border border-border bg-background p-4 text-sm">{lesson}</div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Saved vocabulary</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">{vocabulary.map((word) => <span key={word.word} className="rounded-full bg-muted px-3 py-1 text-sm">{word.word}</span>)}</CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
