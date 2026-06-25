import { AppShell } from "@/components/app-shell";
import { SectionPage } from "@/components/section-page";

export default function ArticlesPage() {
  return (
    <AppShell>
      <SectionPage
        skill="article"
        description="Academic and general English articles with reading time, vocabulary highlighting, questions, and saved articles."
        features={["Read article", "Highlight vocabulary", "Answer questions", "Save for later"]}
      />
    </AppShell>
  );
}
