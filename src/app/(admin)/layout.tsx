"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar(); // <-- hook moved UP (always runs)

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // 🔥 Prevent conditional hook execution — only conditional UI
  if (status === "loading")
    return (
      <div className="flex w-12 h-7 mx-auto mt-[20%] space-x-1">
        <div className="w-1.5 h-full bg-green-500 origin-bottom animate-scaleY" style={{ animationDelay: '-0.4s' }}></div>
        <div className="w-1.5 h-full bg-green-500 origin-bottom animate-scaleY" style={{ animationDelay: '-0.3s' }}></div>
        <div className="w-1.5 h-full bg-green-500 origin-bottom animate-scaleY" style={{ animationDelay: '-0.2s' }}></div>
        <div className="w-1.5 h-full bg-green-500 origin-bottom animate-scaleY" style={{ animationDelay: '-0.1s' }}></div>

        <style jsx>{`
        @keyframes scaleY {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50% { transform: scaleY(0.4); opacity: 0.1; }
        }
        .animate-scaleY {
          animation: scaleY 1s cubic-bezier(.2,.68,.18,1.08) infinite;
        }
      `}</style>
      </div>
    );

  if (!session) return null;

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[200px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-3xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
