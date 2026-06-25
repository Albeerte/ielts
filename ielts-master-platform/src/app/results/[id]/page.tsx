import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tests } from "@/lib/sample-data";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const test = tests.find((item) => item.id === id) ?? tests[0];

  return (
    <AppShell>
      <PageHeading eyebrow="Results" title={`${test.title} report`} description="Final score, band estimate, explanations, mistake analysis, and teacher report." />
      <section className="metric-grid mb-5">
        <Card><CardContent className="p-5"><div className="text-sm text-muted-foreground">Score</div><div className="text-3xl font-bold">31/40</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="text-sm text-muted-foreground">Estimated band</div><div className="text-3xl font-bold">7.0</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="text-sm text-muted-foreground">Weakness</div><div className="text-3xl font-bold">Matching</div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="text-sm text-muted-foreground">Review</div><div className="text-3xl font-bold">Ready</div></CardContent></Card>
      </section>
      <Card>
        <CardHeader><CardTitle>Mistake analysis</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {["Q14: heading too broad", "Q22: plural noun missing", "Q31: synonym recognition issue"].map((mistake) => (
            <div key={mistake} className="rounded-xl border border-border bg-background p-4">{mistake}</div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
