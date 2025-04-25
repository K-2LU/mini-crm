"use client";

import { Sidebar, MobileSidebar } from '@/components/sidebar';
import { usePathname } from 'next/navigation';
import { shouldShowSidebar } from './layout-utils';
import { Providers } from "@/components/providers";

import { useEffect, useState } from 'react';

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = shouldShowSidebar(pathname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render sidebar logic after mount to avoid hydration mismatch
  return (
    <Providers>
      <div className="flex min-h-screen">
        {/* Desktop sidebar - hidden on mobile */}
        {mounted && showSidebar && (
          <div className="hidden w-64 flex-col fixed inset-y-0 z-50 md:flex">
            <Sidebar />
          </div>
        )}
        {/* Mobile sidebar */}
        {mounted && showSidebar && (
          <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
            <MobileSidebar />
            <h1 className="text-xl font-semibold">Mini CRM</h1>
          </div>
        )}
        {/* Main content */}
        <div className={mounted && showSidebar ? "flex-1 md:pl-64" : "flex-1"}>
          {mounted && showSidebar && <div className="h-[57px] md:hidden" />}{/* Mobile navbar spacer */}
          <main className="container mx-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}
