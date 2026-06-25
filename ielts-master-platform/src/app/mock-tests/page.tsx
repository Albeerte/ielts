import { AppShell } from "@/components/app-shell";
import { SectionPage } from "@/components/section-page";

export default function MockTestsPage() {
  return (
    <AppShell>
      <SectionPage
        skill="mock"
        description="Full Reading, Listening, Speaking, Writing, and complete IELTS mock tests with final band estimation and teacher report."
        features={["Section-by-section exam flow", "Final band report", "Strengths and weaknesses", "Teacher review"]}
      />
    </AppShell>
  );
}
