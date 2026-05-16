export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-xl flex-col justify-start px-4 pt-8 pb-20 sm:px-6 sm:pt-12 md:max-w-2xl md:pt-16">
      {children}
    </div>
  );
}
