import Link from "next/link";
import { Clock, FileCheck2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { IeltsTest } from "@/lib/types";

export function TestCard({ test }: { test: IeltsTest }) {
  return (
    <Card className="transition hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex flex-wrap gap-2">
          <Badge>{test.skill}</Badge>
          <Badge className={test.status === "published" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"}>
            {test.status}
          </Badge>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{test.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{test.section} · {test.difficulty} · Band {test.estimatedBand}</p>
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <span><Clock className="mr-2 inline size-4" />{test.duration} minutes</span>
          <span><FileCheck2 className="mr-2 inline size-4" />{test.questions} questions</span>
          <span><Users className="mr-2 inline size-4" />{test.completions} completions</span>
        </div>
        <div className="mt-auto flex gap-2">
          <Button asChild>
            <Link href={`/practice/${test.id}`}>Practice</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/results/${test.id}`}>Review</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
