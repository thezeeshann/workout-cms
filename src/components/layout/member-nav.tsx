"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/member", label: "Home" },
  { href: "/member/workouts", label: "Workouts" },
  { href: "/member/program", label: "My program" },
  { href: "/member/workouts/new", label: "Build workout" },
  { href: "/member/history", label: "History" },
] as const;

function isMemberNavActive(pathname: string, href: string) {
  if (href === "/member") {
    return pathname === "/member";
  }
  if (href === "/member/workouts/new") {
    return pathname === "/member/workouts/new";
  }
  if (href === "/member/workouts") {
    return (
      pathname === "/member/workouts" ||
      (pathname.startsWith("/member/workouts/") &&
        !pathname.startsWith("/member/workouts/new"))
    );
  }
  if (href === "/member/program") {
    return pathname === "/member/program" || pathname.startsWith("/member/program/");
  }
  if (href === "/member/history") {
    return pathname === "/member/history" || pathname.startsWith("/member/history/");
  }
  return pathname === href;
}

export function MemberNav() {
  const pathname = usePathname();

  return (
    <nav
      className="font-heading flex flex-wrap gap-x-4 gap-y-2 border-b border-border pb-4 text-xs font-semibold tracking-[0.12em] uppercase"
      aria-label="Member"
    >
      {links.map((l) => {
        const active = isMemberNavActive(pathname, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "cursor-pointer transition-colors duration-150",
              active
                ? "text-foreground underline decoration-primary decoration-2 underline-offset-4"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-current={active ? "page" : undefined}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
