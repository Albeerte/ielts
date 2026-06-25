import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="Settings" title="Platform preferences" description="Account, notifications, theme, access status, and study settings." />
      <Card className="max-w-3xl">
        <CardHeader><CardTitle>Account settings</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <Input placeholder="Full name" defaultValue="Sardor Usanov" />
          <Input placeholder="Target band" defaultValue="7.5" />
          <Input placeholder="Study hours per week" defaultValue="10" />
          <Button>Save settings</Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
