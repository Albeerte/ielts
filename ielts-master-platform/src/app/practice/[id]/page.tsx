import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { PracticeRunner } from "@/components/practice-runner";
import { tests } from "@/lib/sample-data";

export default async function PracticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const test = tests.find((item) => item.id === id) ?? tests[0];

  return (
    <AppShell>
      <PageHeading eyebrow={`${test.skill} · ${test.section}`} title={test.title} description="Real exam-like practice runner with timer, answer sheet, autosave, review marking, and result summary." />
      <PracticeRunner />
    </AppShell>
  );
}
