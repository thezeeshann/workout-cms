"use client";

import * as React from "react";
import { AuthSuccessToast } from "@/components/auth/auth-success-toast";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryProvider>
        <AuthSuccessToast />
        {children}
        <Toaster richColors position="top-center" />
      </QueryProvider>
    </ThemeProvider>
  );
}
