import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { ChatbotButton } from "@/components/ChatbotButton";

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
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ChatbotButton />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
