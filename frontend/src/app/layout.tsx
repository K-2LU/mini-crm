import { Metadata } from "next";
import SidebarLayout from './SidebarLayout';
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini-CRM",
  description: "A modern CRM application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased" suppressHydrationWarning>
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
