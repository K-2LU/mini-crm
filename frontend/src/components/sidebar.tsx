"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Users } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";

const routes = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Clients",
    href: "/clients",
  },
  {
    label: "Projects",
    href: "/projects",
  },
  {
    label: "Interaction Logs",
    href: "/logs",
  },
  {
    label: "Reminders",
    href: "/reminders",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = require('next/navigation').useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="flex h-full flex-col border-r bg-background dark:bg-sidebar dark:border-sidebar-border">
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded transition-colors duration-150"
          style={{ minHeight: '2.5rem' }}
        >
          <Users className="w-5 h-5" />
          Mini CRM
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 py-4">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              <Button
                variant={pathname === route.href ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4 flex flex-col items-center gap-2">
        <ThemeToggle />
        {/* <Separator className="my-2" /> */}
        <Button
          variant="ghost"
          className="flex items-center justify-center font-semibold bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white hover:text-white w-[90%]"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

interface MobileSidebarProps {
  className?: string;
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        {/* Visually hidden title for accessibility */}
        <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
          <SheetTitle>Navigation</SheetTitle>
        </span>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
