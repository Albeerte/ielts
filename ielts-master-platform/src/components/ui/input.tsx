import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15",
        className,
      )}
      {...props}
    />
  );
}
