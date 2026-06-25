import { AppShell } from "@/components/app-shell";
import { SectionPage } from "@/components/section-page";

export default function ReadingPage() {
  return (
    <AppShell>
      <SectionPage
        skill="reading"
        description="Part 1, Part 2, Part 3, full Reading tests, HTML passage support, auto-scoring, explanations, and mistake analysis."
        features={["Practice passages", "Full mock reading", "Review correct answers", "Track reading progress"]}
      />
    </AppShell>
  );
}
