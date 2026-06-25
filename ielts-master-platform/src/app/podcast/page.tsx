import { AppShell } from "@/components/app-shell";
import { SectionPage } from "@/components/section-page";

export default function PodcastPage() {
  return (
    <AppShell>
      <SectionPage
        skill="podcast"
        description="IELTS learning podcasts with audio, transcripts, vocabulary, comprehension questions, and favorites."
        features={["Listen", "Read transcript", "Save vocabulary", "Answer comprehension questions"]}
      />
    </AppShell>
  );
}
