import { AppShell } from "@/components/app-shell";
import { HtmlBuilder } from "@/components/html-builder";
import { PageHeading } from "@/components/page-heading";

export default function TestBuilderPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="Test Builder" title="Create IELTS tests" description="Build Reading, Listening, Speaking, Writing, mocks, dictations, podcasts, articles, and vocabulary content." />
      <HtmlBuilder />
    </AppShell>
  );
}
