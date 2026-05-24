import Link from "next/link";
import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/api/server-fetch";
import {
  dashboardPathForRole,
  type AppRole,
} from "@/lib/auth/dashboard-path";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function HomePage() {
  const res = await serverFetch("/api/session/context");
  if (res.ok) {
    const data = (await res.json()) as {
      profile: { role: AppRole } | null;
    };
    if (data.profile) {
      redirect(dashboardPathForRole(data.profile.role));
    }
  }

  return (
    <div className="relative mx-auto flex min-h-full max-w-6xl flex-col gap-16 px-4 py-20 sm:py-28">
      <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="hero-stack space-y-8">
          <p className="font-heading text-accent-foreground bg-accent/15 inline-block rounded-full px-3 py-1 text-xs font-bold tracking-[0.25em] uppercase">
            Floor · Rack · Data
          </p>
          <h1 className="font-heading text-foreground max-w-[14ch] text-5xl leading-[0.92] font-extrabold tracking-tight text-balance sm:text-6xl md:text-7xl">
            Run the gym without the spreadsheet chaos.
          </h1>
          <p className="text-muted-foreground max-w-xl text-pretty text-lg leading-relaxed">
            One console for memberships, floor attendance, training programs,
            and coach nutrition notes—typed end-to-end, ready for your crew.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Sign In
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Create Member Account
            </Link>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="border-border bg-card/80 absolute -top-6 -right-6 h-full w-full rounded-2xl border" />
          <div className="border-border bg-card relative rounded-2xl border p-8 shadow-sm">
            <p className="font-heading text-muted-foreground mb-6 text-xs font-bold tracking-[0.2em] uppercase">
              Roles
            </p>
            <ul className="space-y-6 text-sm">
              <li className="flex gap-3">
                <span className="bg-primary text-primary-foreground font-heading flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                  A
                </span>
                <span>
                  <span className="font-semibold">Admin</span>
                  <span className="text-muted-foreground block">
                    Subscriptions, attendance, coach assignments.
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="bg-primary text-primary-foreground font-heading flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                  M
                </span>
                <span>
                  <span className="font-semibold">Members</span>
                  <span className="text-muted-foreground block">
                    Splits, catalog, session history.
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="bg-primary text-primary-foreground font-heading flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold">
                  C
                </span>
                <span>
                  <span className="font-semibold">Coaches</span>
                  <span className="text-muted-foreground block">
                    Diet plans for assigned clients.
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/80 bg-card/60 backdrop-blur-sm transition-[transform,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md">
          <CardHeader>
            <CardTitle className="font-heading text-base tracking-wide uppercase">
              Floor truth
            </CardTitle>
            <CardDescription>
              Present days and subscription end dates in one ledger—no guesswork
              at the desk.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-border/80 bg-card/60 backdrop-blur-sm transition-[transform,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md sm:translate-y-4">
          <CardHeader>
            <CardTitle className="font-heading text-base tracking-wide uppercase">
              Training
            </CardTitle>
            <CardDescription>
              Push/pull/legs templates plus custom programs members can own and
              log.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-border/80 bg-card/60 backdrop-blur-sm transition-[transform,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md sm:-translate-y-2">
          <CardHeader>
            <CardTitle className="font-heading text-base tracking-wide uppercase">
              Coaching
            </CardTitle>
            <CardDescription>
              Scoped client lists so PTs ship diet plans only for who they train.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
