import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theming/theme-provides";

export const metadata: Metadata = {
  title: "Trade Reads",
  description: " Your next great story is just a trade away!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body>{children}</body>
      </ThemeProvider>
    </html>
  );
}
