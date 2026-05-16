"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  users: Users,
} satisfies Record<string, LucideIcon>;

export type DashboardNavIcon = keyof typeof ICONS;

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: DashboardNavIcon;
};

function isActive(pathname: string, href: string) {
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
}

export function DashboardNav({ items }: { items: DashboardNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5" aria-label="Dashboard">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = ICONS[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
