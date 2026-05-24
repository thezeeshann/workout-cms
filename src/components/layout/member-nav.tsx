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
  { href: "/member/profile", label: "Profile" },
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
  if (href === "/member/profile") {
    return pathname === "/member/profile" || pathname.startsWith("/member/profile/");
  }
  return pathname === href;
}

export function MemberNav() {
  const pathname = usePathname();

  return (
    <nav
      className="font-heading flex min-h-10 flex-wrap items-end gap-x-4 gap-y-2 border-b border-border pb-3 text-xs font-semibold tracking-[0.12em] uppercase"
      aria-label="Member"
    >
      {links.map((l) => {
        const active = isMemberNavActive(pathname, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "cursor-pointer border-b-2 pb-2 transition-colors duration-150",
              active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
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
