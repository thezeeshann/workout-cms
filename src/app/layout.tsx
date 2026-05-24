import type { Metadata } from "next";
import { Geist_Mono, Poppins, Syne } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { SkipLink } from "@/components/layout/skip-link";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Gym CMS",
    template: "%s · Gym CMS",
  },
  description:
    "Manage members, workouts, subscriptions, and coaching in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${syne.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full touch-manipulation font-sans" suppressHydrationWarning>
        <AppProviders>
          <SkipLink />
          <div id="main-content" className="flex min-h-full flex-col">
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
