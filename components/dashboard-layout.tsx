"use client";

import type React from "react";

import { useState } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";
import { Bell, ChevronLeft, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  function handleNavigateBack() {
    router.back();
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div
        className={cn(
          "flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        <header className="h-16 border-b flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <DashboardSidebar
                  open={true}
                  setOpen={() => {}}
                  isMobile={true}
                  onMobileLinkClick={() => setMobileSheetOpen(false)}
                />
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-semibold">
              FACILITATOR&apos;S DASHBOARD
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* <ModeToggle /> */}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>FC</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {pathname !== "/" && (
            <div
              className="flex gap-1 bg-gray-100 p-1 w-fit rounded-md text-sm mb-2 cursor-pointer"
              onClick={handleNavigateBack}
            >
              <ChevronLeft className="text-sm" />
              {/* <span>Back</span> */}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
