import { Metadata } from "next";
import { Sidebar, MobileSidebar } from '@/components/sidebar';
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
        <Providers>
            <div className="flex min-h-screen">
              {/* Desktop sidebar - hidden on mobile */}
              <div className="hidden w-64 flex-col fixed inset-y-0 z-50 md:flex">
                <Sidebar />
              </div>
              {/* Mobile sidebar */}
              <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
                <MobileSidebar />
                <h1 className="text-xl font-semibold">Mini CRM</h1>
              </div>
              {/* Main content */}
              <div className="flex-1 md:pl-64">
                <div className="h-[57px] md:hidden" /> {/* Mobile navbar spacer */}
                <main className="container mx-auto p-6">
                  {children}
                </main>
              </div>
            </div>
        </Providers>
      </body>
    </html>
  );
}
