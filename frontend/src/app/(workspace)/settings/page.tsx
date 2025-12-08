"use client";

import { ChevronRight, Copy,Archive } from "lucide-react";
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
    <>
      {/* PART 48: Settings Page Header */}
      <div className="mb-8">
        <h1
          className="font-bold text-[#1F2937]"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "30px" }}
        >
          Settings
        </h1>
        <p className="mt-2 text-[#6B7280]">Manage your farm settings</p>
      </div>

      {/* PART 48: Farm Information */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="font-semibold text-[#1F2937]"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
          >
            Farm Information
          </h2>
          <button className="h-10 px-6 bg-white border border-[#4CAF50] text-[#4CAF50] rounded-lg font-semibold hover:bg-[#F0F9F1] transition-all cursor-pointer">
            Edit Farm
          </button>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-1">Farm Name</div>
                <div className="text-[#1F2937]">Green Valley Farm</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-1">Location</div>
                <div className="text-[#1F2937]">Algiers, Algeria</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-1">Farm Code</div>
                <div className="flex items-center gap-2">
                  <span className="text-[#1F2937]">FARM-ABC123</span>
                  <button className="w-8 h-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-center hover:bg-[#F3F4F6] transition-all cursor-pointer">
                    <Copy size={16} className="text-[#6B7280]" />
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-1">Created</div>
                <div className="text-[#1F2937]">January 2024</div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-1">Total Fields</div>
                <div className="text-[#1F2937]">12</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-1">Total Workers</div>
                <div className="text-[#1F2937]">8</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-1">Active Tasks</div>
                <div className="text-[#1F2937]">34</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFICATION PREFERENCES */}
      <div className="mb-8">
        <h2
          className="font-semibold text-[#1F2937] mb-5"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
        >
          Notification Preferences
        </h2>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
          <div className="space-y-4">
            {/* Checkbox 1 */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-[#4CAF50] border-[#D1D5DB] rounded cursor-pointer"
              />
              <span className="text-[#1F2937]">Task completion notifications</span>
            </label>

            {/* Checkbox 2 */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-[#4CAF50] border-[#D1D5DB] rounded cursor-pointer"
              />
              <span className="text-[#1F2937]">Task overdue alerts</span>
            </label>

            {/* Checkbox 3 */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-[#4CAF50] border-[#D1D5DB] rounded cursor-pointer"
              />
              <span className="text-[#1F2937]">New worker joined</span>
            </label>

            {/* Checkbox 4 */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-[#4CAF50] border-[#D1D5DB] rounded cursor-pointer"
              />
              <span className="text-[#1F2937]">Daily summary email</span>
            </label>

            {/* Checkbox 5 */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 text-[#4CAF50] border-[#D1D5DB] rounded cursor-pointer"
              />
              <span className="text-[#1F2937]">Weekly performance report</span>
            </label>
          </div>

          <button className="mt-6 h-11 px-8 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all cursor-pointer">
            Save Preferences
          </button>
        </div>
      </div>

      {/* ACCOUNT SETTINGS */}
      <div className="mb-8">
        <h2
          className="font-semibold text-[#1F2937] mb-5"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
        >
          Account Settings
        </h2>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
          <div className="space-y-3">
            <button className="w-[300px] h-12 px-5 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-medium hover:bg-[#F9FAFB] transition-all flex items-center justify-between">
              <span>Change Password</span>
              <ChevronRight size={20} className="text-[#9CA3AF]" />
            </button>

            <button className="w-[300px] h-12 px-5 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-medium hover:bg-[#F9FAFB] transition-all flex items-center justify-between">
              <span>Update Profile</span>
              <ChevronRight size={20} className="text-[#9CA3AF]" />
            </button>

            <button className="w-[300px] h-12 px-5 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-medium hover:bg-[#F9FAFB] transition-all flex items-center justify-between">
              <span>Email Preferences</span>
              <ChevronRight size={20} className="text-[#9CA3AF]" />
            </button>
          </div>
        </div>
      </div>
      {/* ARCHIVED FIELDS */}
<div className="mb-8">
  <h2
    className="font-semibold text-[#1F2937] mb-5"
    style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
  >
    Archived Fields
  </h2>

  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-semibold text-[#1F2937] mb-2">
          View Archived Fields
        </h3>
        <p className="text-[#6B7280] mb-4">
          Access and restore fields that have been archived from active use.
        </p>
      </div>
      <button
        onClick={() => router.push("/settings/archived-fields")}
        className="h-11 px-8 bg-[#F59E0B] text-white rounded-lg font-semibold hover:bg-[#D97706] transition-all cursor-pointer flex items-center gap-2"
      >
        <Archive size={18} />
        View Archived
      </button>
    </div>
  </div>
</div>

      {/* DANGER ZONE */}
      <div className="mb-8">
        <h2
          className="font-semibold text-[#F44336] mb-5"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
        >
          Danger Zone
        </h2>

        <div className="bg-white border border-[#F8D7DA] rounded-2xl p-8 shadow-sm">
          <h3 className="font-semibold text-[#721C24] mb-2">Delete Farm Account</h3>
          <p className="text-[#6B7280] mb-5">
            Permanently delete this farm and all data. This action cannot be undone.
          </p>
          <button className="h-11 px-8 bg-[#F44336] text-white rounded-lg font-semibold hover:bg-[#D32F2F] transition-all cursor-pointer">
            Delete Farm
          </button>
        </div>
      </div>
    </>
  );
}
