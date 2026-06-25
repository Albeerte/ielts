import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { vocabulary } from "@/lib/sample-data";

export default function VocabularyPage() {
  const topics = ["Education", "Technology", "Environment", "Health", "Work", "Society", "Travel", "Culture"];

  return (
    <AppShell>
      <PageHeading
        eyebrow="Vocabulary"
        title="Topic vocabulary and spaced repetition"
        description="Word lists, pronunciation, Uzbek translation, examples, synonyms, collocations, quiz mode, and flashcards."
      />
      <section className="grid gap-3 md:grid-cols-4">
        {topics.map((topic) => <Card key={topic}><CardContent className="p-4 font-semibold">{topic}</CardContent></Card>)}
      </section>
      <section className="mt-5 grid gap-4 lg:grid-cols-3">
        {vocabulary.map((item) => (
          <Card key={item.word}>
            <CardHeader><CardTitle>{item.word}</CardTitle></CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <p className="text-muted-foreground">{item.pronunciation}</p>
              <p>{item.meaning}</p>
              <p><strong>Uzbek:</strong> {item.uzbek}</p>
              <p><strong>Example:</strong> {item.example}</p>
              <p><strong>Collocations:</strong> {item.collocations.join(", ")}</p>
              <Button variant="outline">Save word</Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </AppShell>
  );
}
