"use client";

import { ChevronRight, Copy, Archive, MapPin, Building2, X, Save, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomAlert } from "@/components/workspace/CustomAlert";
import { Modal } from "@/components/workspace/modals/Modal";
import { useFarmSettings } from "@/hooks/useFarmSettings"; // Import our custom hook
import { UpdateFarmSettingsData, DeleteFarmAccountData } from "@/types/settings.types"; // Import types

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isEditingFarm, setIsEditingFarm] = useState(false);
  
  // Use our custom hook for farm settings
  const {
    farmSettings,
    loading,
    alert: hookAlert,
    closeAlert,
    fetchFarmSettings,
    updateFarmSettings,
    deleteFarmAccount,
  } = useFarmSettings();

  // Local form states
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFormData, setDeleteFormData] = useState({
    password: "",
    confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Fetch farm settings on component mount
  useEffect(() => {
    if (user?.role === "admin") {
      fetchFarmSettings();
    }
  }, [user]);

  // Update form data when farm settings are loaded
  useEffect(() => {
    if (farmSettings) {
      setFormData({
        name: farmSettings.name,
        location: farmSettings.location,
      });
    }
  }, [farmSettings]);

  // Check if user is admin (access control)
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/workspace/dashboard");
    }
  }, [user, router]);

  // Handle copying farm join code
  const handleCopyFarmCode = async () => {
    if (!farmSettings?.joinCode) return;
    
    try {
      await navigator.clipboard.writeText(farmSettings.joinCode);
      // We'll use the hook's alert system
      // Alert will be shown by the hook's success/error handlers
    } catch (error) {
      console.error("Failed to copy farm code:", error);
    }
  };

  // Handle saving farm information
  const handleSaveFarm = async () => {
    // Validation
    if (!formData.name.trim() || !formData.location.trim()) {
      // We could add a local alert here, but the hook will handle validation errors
      return;
    }

    try {
      const updateData: UpdateFarmSettingsData = {
        name: formData.name,
        location: formData.location,
      };
      
      await updateFarmSettings(updateData);
      setIsEditingFarm(false);
    } catch (error) {
      // Error is already handled by the hook and shown via CustomAlert
      console.error("Failed to update farm:", error);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditingFarm(false);
    // Reset form data to current farm settings
    if (farmSettings) {
      setFormData({
        name: farmSettings.name,
        location: farmSettings.location,
      });
    }
  };

  // Handle farm deletion
  const handleDeleteFarm = async () => {
    // Validation
    if (!deleteFormData.password) {
      // We could show an alert here, but the backend will validate
      return;
    }

    if (deleteFormData.confirmation !== "DELETE MY FARM") {
      // We could show an alert here, but the backend will validate
      return;
    }

    try {
      const deleteData: DeleteFarmAccountData = {
        password: deleteFormData.password,
        confirmation: deleteFormData.confirmation,
      };
      
      await deleteFarmAccount(deleteData);
      // The hook handles the success alert and redirect
      handleCloseDeleteModal();
    } catch (error) {
      // Error is already handled by the hook
      console.error("Failed to delete farm:", error);
    }
  };

  // Close delete modal and reset form
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteFormData({
      password: "",
      confirmation: "",
    });
    setShowPassword(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  // Show loading state
  if (loading && !farmSettings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto"></div>
          <p className="mt-4 text-[#6B7280]">Loading farm settings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Settings Page Header */}
      <div className="mb-8">
        <h1
          className="font-bold text-[#1F2937]"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: "30px" }}
        >
          Settings
        </h1>
        <p className="mt-2 text-[#6B7280]">Manage your farm settings</p>
      </div>

      {/* Farm Information Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="font-semibold text-[#1F2937]"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px" }}
          >
            Farm Information
          </h2>
          {!isEditingFarm && farmSettings ? (
            <button
              onClick={() => setIsEditingFarm(true)}
              className="h-10 px-6 bg-white border border-[#4CAF50] text-[#4CAF50] rounded-lg font-semibold hover:bg-[#F0F9F1] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Edit Farm
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                disabled={loading}
                className="h-10 px-5 bg-white border border-[#D1D5DB] text-[#6B7280] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSaveFarm}
                disabled={loading}
                className="h-10 px-5 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Save size={16} />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Farm Information Card */}
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
                  <div className="text-[#1F2937]">
                    {farmSettings?.name || "Loading..."}
                  </div>
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
                  <div className="text-[#1F2937]">
                    {farmSettings?.location || "Loading..."}
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-2">Farm Code</div>
                <div className="flex items-center gap-2">
                  <span className="text-[#1F2937] font-mono bg-[#F9FAFB] px-3 py-2 rounded-lg border border-[#E5E7EB]">
                    {farmSettings?.joinCode || "Loading..."}
                  </span>
                  <button
                    onClick={handleCopyFarmCode}
                    className="w-9 h-9 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg flex items-center justify-center hover:bg-[#4CAF50] hover:border-[#4CAF50] group transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Copy farm code"
                    disabled={!farmSettings?.joinCode || loading}
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
                <div className="text-[#1F2937]">
                  {farmSettings?.createdAt ? formatDate(farmSettings.createdAt) : "Loading..."}
                </div>
              </div>
            </div>

            {/* Right Column - Statistics */}
            <div>
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-2">Total Fields</div>
                <div className="text-[#1F2937]">
                  {farmSettings?.totalFields ?? "Loading..."}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-2">Total Workers</div>
                <div className="text-[#1F2937]">
                  {farmSettings?.totalWorkers ?? "Loading..."}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="font-semibold text-[#6B7280] mb-2">Active Tasks</div>
                <div className="text-[#1F2937]">
                  {farmSettings?.activeTasks ?? "Loading..."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Archived Fields Section */}
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
              onClick={() => router.push("/settings/archived-fields")} // Updated route
              className="h-11 px-8 bg-[#F59E0B] text-white rounded-lg font-semibold hover:bg-[#D97706] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <Archive size={18} />
              View Archived
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
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
            className="h-11 px-8 bg-[#F44336] text-white rounded-lg font-semibold hover:bg-[#D32F2F] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !farmSettings}
          >
            Delete Farm
          </button>
        </div>
      </div>

      {/* Custom Alert from hook */}
      <CustomAlert
        isOpen={hookAlert.isOpen}
        onClose={closeAlert}
        type={hookAlert.type}
        message={hookAlert.message}
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
              disabled={loading}
              className="h-11 px-6 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteFarm}
              disabled={loading}
              className="h-11 px-6 bg-[#F44336] text-white rounded-lg font-semibold hover:bg-[#D32F2F] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Deleting..." : "Delete Farm"}
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
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1F2937] transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
              disabled={loading}
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