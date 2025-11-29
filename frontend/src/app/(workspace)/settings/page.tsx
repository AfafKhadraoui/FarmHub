"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only admins can access settings page
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
    </div>
  );
}
