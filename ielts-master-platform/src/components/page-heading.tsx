import { Badge } from "@/components/ui/badge";

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <Badge className="mb-3">{eyebrow}</Badge> : null}
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
      {action}
    </section>
  );
}
