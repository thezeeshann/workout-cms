import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LogoutButton } from "@/components/auth/logout-button";

export function SectionHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-balance">
          {title}
        </h1>
        {children ? (
          <div className="mt-1 text-sm text-muted-foreground">{children}</div>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LogoutButton />
      </div>
    </header>
  );
}
