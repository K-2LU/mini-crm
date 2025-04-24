"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Dashboard auth state:', { isLoading, user: !!user });
    if (!isLoading && !user) {
      console.log('No user found, redirecting to login...');
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {user && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl mb-4">Welcome, {user.email}!</h2>
            <p className="text-gray-600">
              You are successfully logged in to your dashboard.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
