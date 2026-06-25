import { AppShell } from "@/components/app-shell";
import { SectionPage } from "@/components/section-page";

export default function DictationPage() {
  return (
    <AppShell>
      <SectionPage
        skill="dictation"
        description="Audio dictation exercises with typed transcript comparison, highlighted mistakes, and accuracy percentage."
        features={["Listen and type", "Compare transcript", "Highlight mistakes", "Accuracy tracking"]}
      />
    </AppShell>
  );
}
