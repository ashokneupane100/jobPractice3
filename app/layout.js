import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import { Suspense } from "react";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import {Toaster} from "sonner";

const lora = localFont({
  src: [
    {
      path: "./fonts/lora-latin.woff2",
      weight: "400 500",
      style: "normal",
    },
    {
      path: "./fonts/lora-italic-latin.woff2",
      weight: "400 500",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = localFont({
  src: [
    {
      path: "./fonts/dm-sans-latin.woff2",
      weight: "400 700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Prept — Your next chapter starts here",
  description:
    "Prepare for your next opportunity with a thoughtful community of candidates and mentors.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lora.variable} ${dmSans.variable} font-sans`}>
        <Suspense fallback={null}>
          <ClerkProvider appearance={{ theme: shadcn }}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <main className="min-h-screen">
                <Header />
                {children}
              </main>
              <Toaster richColors/>
            </ThemeProvider>
          </ClerkProvider>
        </Suspense>
      </body>
    </html>
  );
}
