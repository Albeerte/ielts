import { CheckCircle2, ClipboardList, LineChart, PlayCircle } from "lucide-react";

import { PageHeading } from "@/components/page-heading";
import { TestCard } from "@/components/test-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { tests } from "@/lib/sample-data";
import type { Skill } from "@/lib/types";

const labels: Record<string, string> = {
  reading: "Reading",
  listening: "Listening",
  speaking: "Speaking",
  writing: "Writing",
  dictation: "Dictation",
  podcast: "Podcast",
  article: "Articles",
  vocabulary: "Vocabulary",
  mock: "Mock Tests",
};

export function SectionPage({
  skill,
  description,
  features,
}: {
  skill: Skill;
  description: string;
  features: string[];
}) {
  const sectionTests = tests.filter((test) => test.skill === skill);

  return (
    <>
      <PageHeading eyebrow="Practice · Mock · Review · Progress" title={labels[skill]} description={description} />
      <section className="metric-grid mb-5">
        <Card>
          <CardContent className="p-5">
            <PlayCircle className="mb-3 size-5 text-indigo-500" />
            <div className="text-2xl font-bold">{sectionTests.length || 8}</div>
            <div className="text-sm text-muted-foreground">practice sets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <CheckCircle2 className="mb-3 size-5 text-emerald-500" />
            <div className="text-2xl font-bold">74%</div>
            <div className="text-sm text-muted-foreground">completion rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <LineChart className="mb-3 size-5 text-sky-500" />
            <div className="text-2xl font-bold">+0.4</div>
            <div className="text-sm text-muted-foreground">band improvement</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <ClipboardList className="mb-3 size-5 text-amber-500" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">reviews pending</div>
          </CardContent>
        </Card>
      </section>

      <section className="page-grid">
        <div className="grid gap-4 md:grid-cols-2">
          {(sectionTests.length ? sectionTests : tests.slice(0, 4)).map((test) => (
            <TestCard key={test.id} test={{ ...test, skill }} />
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{labels[skill]} workflow</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {features.map((feature, index) => (
              <div key={feature}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{index + 1}. {feature}</span>
                  <span className="text-muted-foreground">{85 - index * 7}%</span>
                </div>
                <Progress value={85 - index * 7} />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
