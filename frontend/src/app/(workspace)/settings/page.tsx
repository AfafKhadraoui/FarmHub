"use client";

import { ChevronRight, Copy, Archive, MapPin, Building2, X, Save, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CustomAlert } from "@/components/workspace/CustomAlert";
import { Modal } from "@/components/workspace/modals/Modal";
import { useState } from "react";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isEditingFarm, setIsEditingFarm] = useState(false);
  const [savingFarm, setSavingFarm] = useState(false);
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    message: string;
  }>({
    isOpen: false,
    type: "success",
    message: "",
  });

  // Mock farm data - replace with actual API data when ready
  const [farmData] = useState({
    name: "Green Valley Farm",
    location: "Algiers, Algeria",
    farmCode: "FARM-ABC123",
    created: "January 2024",
    totalFields: 12,
    totalWorkers: 8,
    activeTasks: 34,
  });

  const [formData, setFormData] = useState({
    name: farmData.name,
    location: farmData.location,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFormData, setDeleteFormData] = useState({
    password: "",
    confirmation: "",
  });
  const [deletingFarm, setDeletingFarm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCopyFarmCode = async () => {
    try {
      await navigator.clipboard.writeText(farmData.farmCode);
      setAlert({
        isOpen: true,
        type: "success",
        message: "Farm code copied to clipboard!",
      });
      setTimeout(() => setAlert({ ...alert, isOpen: false }), 3000);
    } catch (error) {
      setAlert({
        isOpen: true,
        type: "error",
        message: "Failed to copy farm code",
      });
      setTimeout(() => setAlert({ ...alert, isOpen: false }), 3000);
    }
  };

  const handleSaveFarm = async () => {
    // Validation
    if (!formData.name.trim() || !formData.location.trim()) {
      setAlert({
        isOpen: true,
        type: "error",
        message: "Please fill in all fields",
      });
      setTimeout(() => setAlert({ ...alert, isOpen: false }), 3000);
      return;
    }

    setSavingFarm(true);

    try {
      // TODO: Replace with actual API call when ready
      // const response = await fetch('/settings/farm', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //   },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     location: formData.location
      //   })
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || 'Failed to update farm information');
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAlert({
        isOpen: true,
        type: "success",
        message: "Farm information updated successfully!",
      });
      setTimeout(() => setAlert({ ...alert, isOpen: false }), 3000);
      setIsEditingFarm(false);
    } catch (error: any) {
      setAlert({
        isOpen: true,
        type: "error",
        message: error.message || "Failed to update farm information",
      });
      setTimeout(() => setAlert({ ...alert, isOpen: false }), 3000);
    } finally {
      setSavingFarm(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingFarm(false);
    // Reset form data to original values
    setFormData({
      name: farmData.name,
      location: farmData.location,
    });
  };
  const handleDeleteFarm = async () => {
    // Validation
    if (!deleteFormData.password) {
      setAlert({
        isOpen: true,
        type: "error",
        message: "Please enter your password",
      });
      setTimeout(() => setAlert({ ...alert, isOpen: false }), 3000);
      return;
    }

    if (deleteFormData.confirmation !== "DELETE MY FARM") {
      setAlert({
        isOpen: true,
        type: "error",
        message: "Please type 'DELETE MY FARM' to confirm",
      });
      setTimeout(() => setAlert({ ...alert, isOpen: false }), 3000);
      return;
    }

    setDeletingFarm(true);

    try {
      // TODO: Replace with actual API call when ready
      // const response = await fetch('/settings/farm', {
      //   method: 'DELETE',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //   },
      //   body: JSON.stringify({
      //     password: deleteFormData.password,
      //     confirmation: deleteFormData.confirmation
      //   })
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || 'Failed to delete farm account');
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear tokens and redirect to login
      localStorage.removeItem("accessToken");
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setAlert({
        isOpen: true,
        type: "success",
        message: "Farm account deleted successfully",
      });

      // Redirect after showing success message
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error: any) {
      setAlert({
        isOpen: true,
        type: "error",
        message: error.message || "Failed to delete farm account",
      });
      setTimeout(() => setAlert({ ...alert, isOpen: false }), 3000);
    } finally {
      setDeletingFarm(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteFormData({
      password: "",
      confirmation: "",
    });
    setShowPassword(false);
  };

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
      {/* PART 48: Farm Information */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="font-semibold text-[#1F2937]"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
          >
            Farm Information
          </h2>
          {!isEditingFarm ? (
            <button
              onClick={() => setIsEditingFarm(true)}
              className="h-10 px-6 bg-white border border-[#4CAF50] text-[#4CAF50] rounded-lg font-semibold hover:bg-[#F0F9F1] transition-all cursor-pointer"
            >
              Edit Farm
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                disabled={savingFarm}
                className="h-10 px-5 bg-white border border-[#D1D5DB] text-[#6B7280] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSaveFarm}
                disabled={savingFarm}
                className="h-10 px-5 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Save size={16} />
                {savingFarm ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* ADD THIS WRAPPER DIV */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-2 font-semibold text-[#6B7280] mb-2">
                  <Building2 size={16} />
                  Farm Name
                </div>
                {isEditingFarm ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter farm name"
                  />
                ) : (
                  <div className="text-[#1F2937]">{farmData.name}</div>
                )}
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-2 font-semibold text-[#6B7280] mb-2">
                  <MapPin size={16} />
                  Location
                </div>
                {isEditingFarm ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    placeholder="Enter location"
                  />
                ) : (
                  <div className="text-[#1F2937]">{farmData.location}</div>
                )}
              </div>
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-2">Farm Code</div>
                <div className="flex items-center gap-2">
                  <span className="text-[#1F2937] font-mono bg-[#F9FAFB] px-3 py-2 rounded-lg border border-[#E5E7EB]">
                    {farmData.farmCode}
                  </span>
                  <button
                    onClick={handleCopyFarmCode}
                    className="w-9 h-9 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-center hover:bg-[#4CAF50] hover:border-[#4CAF50] group transition-all cursor-pointer"
                    title="Copy farm code"
                  >
                    <Copy size={16} className="text-[#6B7280] group-hover:text-white transition-colors" />
                  </button>
                </div>
                <p className="text-[#9CA3AF] text-[12px] mt-1">
                  Share this code with workers to join your farm
                </p>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-2">Created</div>
                <div className="text-[#1F2937]">{farmData.created}</div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-2">Total Fields</div>
                <div className="text-[#1F2937]">{farmData.totalFields}</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-2">Total Workers</div>
                <div className="text-[#1F2937]">{farmData.totalWorkers}</div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-2">Active Tasks</div>
                <div className="text-[#1F2937]">{farmData.activeTasks}</div>
              </div>
            </div>
          </div>
        </div>
        {/* END OF WRAPPER DIV */}
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
          <button
            onClick={() => setShowDeleteModal(true)}
            className="h-11 px-8 bg-[#F44336] text-white rounded-lg font-semibold hover:bg-[#D32F2F] transition-all cursor-pointer"
          >
            Delete Farm
          </button>
        </div>
      </div>
      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        type={alert.type}
        message={alert.message}
      />
      {/* Delete Farm Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        title=""
        width="550px"
        showCloseButton={false}
        footer={
          <>
            <button
              onClick={handleCloseDeleteModal}
              disabled={deletingFarm}
              className="h-11 px-6 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteFarm}
              disabled={deletingFarm}
              className="h-11 px-6 bg-[#F44336] text-white rounded-lg font-semibold hover:bg-[#D32F2F] transition-all disabled:opacity-50"
            >
              {deletingFarm ? "Deleting..." : "Delete Farm"}
            </button>
          </>
        }
      >
        <div className="py-2">
          {/* Warning Icon */}
          <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={36} className="text-[#F44336]" />
          </div>

          {/* Title */}
          <h2
            className="font-bold text-[#1F2937] mb-3 text-center"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px" }}
          >
            Delete Farm Account?
          </h2>

          {/* Warning Message */}
          <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg p-4 mb-6">
            <p className="text-[#991B1B] text-[14px] font-medium mb-2">
              ⚠️ This action is permanent and cannot be undone!
            </p>
            <p className="text-[#6B7280] text-[13px]">
              Deleting your farm will permanently remove:
            </p>
            <ul className="text-[#6B7280] text-[13px] mt-2 ml-4 space-y-1">
              <li>• All fields and their data</li>
              <li>• All workers and their assignments</li>
              <li>• All tasks and history</li>
              <li>• All reports and analytics</li>
            </ul>
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2 text-[14px]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={deleteFormData.password}
                onChange={(e) =>
                  setDeleteFormData({ ...deleteFormData, password: e.target.value })
                }
                placeholder="Enter your password"
                className="w-full h-11 px-4 pr-12 border border-[#D1D5DB] rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#F44336] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937] transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-[#6B7280] font-semibold mb-2 text-[14px]">
              Type "DELETE MY FARM" to confirm
            </label>
            <input
              type="text"
              value={deleteFormData.confirmation}
              onChange={(e) =>
                setDeleteFormData({ ...deleteFormData, confirmation: e.target.value })
              }
              placeholder="DELETE MY FARM"
              className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#F44336] focus:border-transparent font-mono"
            />
            <p className="text-[#9CA3AF] text-[12px] mt-1">
              This must match exactly (case-sensitive)
            </p>
          </div>

          {/* Final Warning */}
          <div className="bg-[#FEF2F2] border-l-4 border-[#F44336] p-3 mt-5">
            <p className="text-[#991B1B] text-[13px] font-semibold">
              Once you delete your farm, there is no going back. Please be certain.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
