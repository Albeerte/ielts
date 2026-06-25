import Link from "next/link";
import { ArrowRight, CheckCircle2, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const features = ["Role dashboards", "HTML Reading Builder", "IELTS mock tests", "Vocabulary SRS", "Individual Learning Room"];

  return (
    <main className="min-h-screen px-4 py-6">
      <header className="mx-auto flex max-w-7xl items-center justify-between rounded-3xl border border-border bg-background/80 px-4 py-3 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap />
          </div>
          <div>
            <div className="font-bold">IELTS Master Platform</div>
            <div className="text-xs text-muted-foreground">Premium IELTS academy system</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Open demo</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-emerald-500" /> Clean, scalable, role-based IELTS learning
          </div>
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            IELTS learning platform for students, teachers, and admins.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Dashboard, practice modules, HTML test builder, teacher feedback, vocabulary, podcasts, dictations, full mocks, and individual learning rooms in one premium interface.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/dashboard">Start learning <ArrowRight /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/test-builder/html-reading">Open HTML Builder</Link>
            </Button>
          </div>
        </div>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="border-b border-border bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 p-5 text-white">
              <div className="text-sm opacity-85">Band progress</div>
              <div className="mt-2 text-5xl font-bold">6.5 → 7.5</div>
            </div>
            <div className="grid gap-4 p-5">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
                  <CheckCircle2 className="size-5 text-emerald-500" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {["Student progress", "Teacher control", "Admin analytics"].map((title, index) => (
          <Card key={title}>
            <CardContent className="p-5">
              <ShieldCheck className="mb-4 size-6 text-primary" />
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {index === 0 && "Personal targets, weak skills, saved words, mistake history, and feedback."}
                {index === 1 && "Private tasks, group tasks, lessons, mock assignments, and review queue."}
                {index === 2 && "Manage users, content, access status, tests, and platform analytics."}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
