"use client";

import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  Home,
  // Settings,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile?: boolean;
  onMobileLinkClick?: () => void;
}

export function DashboardSidebar({
  open,
  setOpen,
  isMobile = false,
  onMobileLinkClick,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Courses",
      href: "/courses",
      icon: BookOpen,
    },
    {
      name: "Library",
      href: "/library",
      icon: FileText,
    },
    {
      name: "Students",
      href: "/students",
      icon: Users,
    },
    {
      name: "Schedule",
      href: "/schedule",
      icon: Calendar,
    },
    {
      name: "Assignments",
      href: "/assignments",
      icon: GraduationCap,
    },
    // {
    //   name: "Settings",
    //   href: "/settings",
    //   icon: Settings,
    // },
  ];

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            {/* <GraduationCap className="h-5 w-5 text-primary-foreground" /> */}
            {/* use the log image */}
            <Image
              alt="Titans Career Logo"
              src="https://titanscareers.com/assets/logo-DMzVeG9H.png"
              width={32}
              height={32}
            />
          </div>
          {(open || isMobile) && (
            <span className="font-semibold text-black">TITANS CAREER</span>
          )}
        </div>
        {!isMobile && (
          <button
            onClick={() => setOpen(!open)}
            className="hidden lg:flex h-8 w-8 items-center bg-primary justify-center rounded-md hover:bg-[#242428]"
          >
            {open ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto py-4 md:px-4">
        <nav className="grid gap-3 px-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onMobileLinkClick : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-primary hover:text-white",
                pathname === item.href ? "bg-primary text-white" : "text-black",
                !open && !isMobile && "justify-center"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", !open && !isMobile && "h-6 w-6")}
              />
              {(open || isMobile) && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#242428] flex items-center justify-center">
            <span className="text-sm font-medium">
              {user ? `${user.first_name[0]}${user.last_name[0]}` : "FC"}
            </span>
          </div>
          {(open || isMobile) && (
            <div className="bg-card text-card-foreground p-2 rounded-md">
              <p className="text-sm font-medium">
                {user
                  ? `${user.first_name} ${user.last_name}`
                  : "Facilitator Name"}
              </p>
              <p className="text-xs text-[hsl(var(--sidebar-muted))]">
                {user?.role
                  ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
                  : "Lecturer"}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // For mobile, just return the content (will be wrapped in Sheet)
  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-sidebar-background text-white">
        {sidebarContent}
      </div>
    );
  }

  // For desktop, return the full sidebar with responsive behavior
  return (
    <div
      className={cn(
        "hidden lg:flex fixed inset-y-0 left-0 z-50 flex-col bg-sidebar-background text-white transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-20"
      )}
    >
      {sidebarContent}
    </div>
  );
}
