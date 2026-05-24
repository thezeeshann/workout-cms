import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center gap-6 px-4 py-16">
      <p className="font-heading text-muted-foreground text-sm font-semibold tracking-[0.2em] uppercase">
        404
      </p>
      <h1 className="font-heading text-3xl text-balance tracking-tight sm:text-4xl">
        This page is not in your program.
      </h1>
      <p className="text-muted-foreground text-pretty">
        The URL may be wrong or the resource was removed. Head back and pick
        another route.
      </p>
      <Link href="/" className={cn(buttonVariants(), "w-fit")}>
        Return home
      </Link>
    </div>
  );
}
