export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="bg-primary text-primary-foreground focus-visible:ring-ring sr-only fixed top-4 left-4 z-[100] rounded-md px-4 py-2 text-sm font-medium focus:not-sr-only focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      Skip to main content
    </a>
  );
}
