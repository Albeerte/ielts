import { AppShell } from "@/components/app-shell";
import { HtmlBuilder } from "@/components/html-builder";
import { PageHeading } from "@/components/page-heading";

export default function HtmlReadingBuilderPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="HTML Reading Builder" title="Paste safe HTML reading tests" description="Admin or teacher can paste HTML passage and question code, preview safely, add answer keys, explanations, difficulty, band level, and tags." />
      <HtmlBuilder />
    </AppShell>
  );
}
