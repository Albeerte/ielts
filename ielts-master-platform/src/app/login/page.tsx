import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to IELTS Master</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Button asChild><Link href="/dashboard">Login</Link></Button>
          <p className="text-sm text-muted-foreground">No account? <Link href="/register" className="text-primary">Register</Link></p>
        </CardContent>
      </Card>
    </main>
  );
}
