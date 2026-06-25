import { Progress } from "@/components/ui/progress";
import { skillProgress } from "@/lib/sample-data";

export function BandScoreChart() {
  return (
    <div className="grid gap-4">
      {skillProgress.map((skill) => (
        <div key={skill.label}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">{skill.label}</span>
            <span className="text-muted-foreground">Band {skill.score}</span>
          </div>
          <Progress value={(skill.score / 9) * 100} />
        </div>
      ))}
    </div>
  );
}
