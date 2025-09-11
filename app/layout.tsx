import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Titans Careers Connect - Facilitator Dashboard",
  description: "Dashboard for facilitators on Titans Careers platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* Botpress Chatbot Scripts */}
        <script src="https://cdn.botpress.cloud/webchat/v3.2/inject.js"></script>
        <script
          src="https://files.bpcontent.cloud/2025/09/08/12/20250908124113-71Q3RR0M.js"
          defer
        ></script>
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
