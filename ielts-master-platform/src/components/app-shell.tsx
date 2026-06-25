"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  FileAudio,
  FileText,
  GraduationCap,
  Headphones,
  Home,
  MessageSquareText,
  Mic,
  PenLine,
  Settings,
  Target,
  User,
  Users,
  WalletCards,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/reading", label: "Reading", icon: BookOpen },
  { href: "/listening", label: "Listening", icon: Headphones },
  { href: "/speaking", label: "Speaking", icon: Mic },
  { href: "/writing", label: "Writing", icon: PenLine },
  { href: "/mock-tests", label: "Mock Tests", icon: Target },
  { href: "/dictation", label: "Dictation", icon: FileAudio },
  { href: "/podcast", label: "Podcast", icon: MessageSquareText },
  { href: "/articles", label: "Articles", icon: FileText },
  { href: "/vocabulary", label: "Vocabulary", icon: WalletCards },
  { href: "/progress", label: "My Progress", icon: BarChart3 },
  { href: "/feedback", label: "Teacher Feedback", icon: GraduationCap },
  { href: "/profile/student", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-border bg-sidebar/80 p-4 backdrop-blur-xl lg:block">
        <Link href="/" className="mb-6 flex items-center gap-3 rounded-2xl px-2 py-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            IM
          </div>
          <div>
            <div className="font-bold">IELTS Master</div>
            <div className="text-xs text-muted-foreground">Premium Academy</div>
          </div>
        </Link>
        <nav className="grid gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  active && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm text-muted-foreground">IELTS Master Platform</div>
              <div className="truncate text-lg font-semibold">Welcome back, {currentUser.name}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="hidden bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 sm:inline-flex">
                {currentUser.role}
              </Badge>
              <ThemeToggle />
              <Button variant="outline" size="icon" asChild>
                <Link href="/teacher/dashboard" aria-label="Teacher dashboard">
                  <Users />
                </Link>
              </Button>
            </div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navItems.slice(0, 10).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium",
                  pathname === item.href && "border-primary bg-primary text-primary-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="p-4 sm:p-6 xl:p-8">{children}</main>
      </div>
    </div>
  );
}
