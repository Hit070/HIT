"use client";

import { useAuthStore } from "@/store/store";

export default function DashboardLayout({ children: children }: { children: React.ReactNode }) {
    const { isLoading } = useAuthStore();

    // Show loading state while redirecting
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-prima border-t-transparent"></div>
            </div>
        );
    }

    return <>{children}</>;
}
