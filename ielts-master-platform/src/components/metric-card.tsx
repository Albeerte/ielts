import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  helper,
  trend,
}: {
  label: string;
  value: string;
  helper: string;
  trend?: number;
}) {
  const positive = (trend ?? 0) >= 0;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-2 text-3xl font-bold">{value}</div>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          {trend !== undefined ? (
            <span className={positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
              {positive ? <ArrowUpRight className="inline size-4" /> : <ArrowDownRight className="inline size-4" />} {Math.abs(trend)}
            </span>
          ) : null}
          {helper}
        </div>
      </CardContent>
    </Card>
  );
}
