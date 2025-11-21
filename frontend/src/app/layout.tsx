import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ConnectionGuard } from "@/components/common/ConnectionGuard";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { themeScript } from "@/lib/theme-script";
import { NextIntlClientProvider } from "next-intl";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CSB-KMS",
  description: "Privacy-focused research and knowledge management",
};

export default function RootLayout({
  children,
  searchParams
}: Readonly<{
  children: React.ReactNode;
  searchParams?: Record<string, string>
}>) {
  const lang = searchParams?.lang || 'vi';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <ErrorBoundary>
            <ThemeProvider>
              <QueryProvider>
                <ConnectionGuard>
                  {children}
                  <Toaster />
                </ConnectionGuard>
              </QueryProvider>
            </ThemeProvider>
          </ErrorBoundary>
        </LanguageProvider>
      </body>
    </html>
  );
}
