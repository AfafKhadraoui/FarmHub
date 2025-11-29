"use client";

import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <p className="text-gray-900">{user?.name || "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-gray-900">{user?.email || "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <p className="text-gray-900">
              {user?.role === "admin" ? "Farm Admin" : "Worker"}
            </p>
          </div>
          {user?.farmName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Farm
              </label>
              <p className="text-gray-900">{user.farmName}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
