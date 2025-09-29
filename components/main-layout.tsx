"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/store";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  // Check if we're on special pages that don't need the dashboard layout
  const isLoginPage = pathname === "/login";
  const isStorePage = pathname.startsWith("/store");
  const isRootPage = pathname === "/";
  const isHomePage = pathname.startsWith("/home");
  const isNotFoundPage = pathname === "/not-found" || pathname.startsWith("/_not-found");

  // Define your valid protected routes here
  const validProtectedRoutes = [
    "/dashboard",
    "/analytics",
    "/blogs",
    "/discounts",
    "/events",
    "/products",
    "/inventory",
    "/orders",
    "/stories",
    "/settings",
    // Add all your valid dashboard routes here
  ];

  // Check if current path is a valid protected route
  const isValidProtectedRoute = validProtectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // For unauthenticated users on protected routes, redirect to login
  useEffect(() => {
    if (isLoading) return; // Wait for loading to complete

    // Only redirect if we're on a protected route and definitely have no user
    if (!user && !isLoginPage && !isStorePage && !isRootPage && !isHomePage && !isNotFoundPage) {
      // Add a small delay to ensure auth state has fully resolved
      const timer = setTimeout(() => {
        if (!user) {
          // Double-check user is still null
          router.push("/login");
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [user, isLoading, isLoginPage, isStorePage, isRootPage, isHomePage, isNotFoundPage, router]);

  // If we're on special pages (login, store, root, home, or 404), don't wrap with the dashboard layout
  if (isLoginPage || isStorePage || isRootPage || isHomePage || isNotFoundPage) {
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Only render dashboard layout for authenticated users on valid routes
  if (user && isValidProtectedRoute) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  // For invalid routes or unauthenticated access, just render children
  // (Next.js will handle 404 properly)
  return <>{children}</>;
}