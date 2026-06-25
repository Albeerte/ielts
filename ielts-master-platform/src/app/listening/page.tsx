import { AppShell } from "@/components/app-shell";
import { SectionPage } from "@/components/section-page";

export default function ListeningPage() {
  return (
    <AppShell>
      <SectionPage
        skill="listening"
        description="Four listening parts, audio player, replay limits, transcripts after submission, auto-scoring, and mistake review."
        features={["Audio practice", "Full listening mock", "Transcript review", "Replay limit analysis"]}
      />
    </AppShell>
  );
}
