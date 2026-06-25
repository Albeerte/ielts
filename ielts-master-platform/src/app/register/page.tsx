import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create your IELTS account</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input placeholder="Full name" />
          <Input placeholder="Email" type="email" />
          <Input placeholder="Target band score" />
          <Input placeholder="Password" type="password" />
          <Button asChild><Link href="/dashboard">Create account</Link></Button>
        </CardContent>
      </Card>
    </main>
  );
}
