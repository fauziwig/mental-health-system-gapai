import type { Metadata } from "next";
import "./globals.css";
import { BrandProvider } from "@/components/branding/BrandProvider";

export const metadata: Metadata = {
  title: "Mental Health Assessment System | WHO-5",
  description: "Company Mental Health Assessment Platform (WHO-5 Index)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <BrandProvider>{children}</BrandProvider>
      </body>
    </html>
  );
}
