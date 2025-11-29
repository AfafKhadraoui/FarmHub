"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkersPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only admins can access workers page
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Workers</h1>
        <p className="text-gray-600">Manage your farm workers</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-600">Workers management page - Coming soon</p>
      </div>
    </div>
  );
}
