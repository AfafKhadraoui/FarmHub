"use client";

import React, { useState, use } from "react";
import {
  ArrowLeft,
  MapPin,
  Droplet,
  Leaf,
  Bug,
  Plus,
  Calendar,
  Edit2,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { EditFieldModal } from "@/components/workspace/modals/EditFieldModal";
import { ArchiveFieldModal } from "@/components/workspace/modals/ArchiveFieldModal";
import { CreateTaskModal } from "@/components/workspace/modals/CreateTaskModal";

export default function FieldDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showAssignWorkersModal, setShowAssignWorkersModal] = useState(false);

  // Determine user role
  const isAdmin = user?.role === "admin";
  const isWorker = user?.role === "worker";

  return (
    <>
      {/* PART 29: Field Details Header & Navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => router.push("/fields")}
            className="flex items-center gap-2 text-[#4CAF50] font-medium hover:underline cursor-pointer"
          >
            <ArrowLeft size={20} />
            Back to Fields
          </button>

          {/* Action Buttons - Farmer/Admin only */}
          {isAdmin && (
            <div className="flex items-center gap-3">
              {/* Edit Button */}
              <button
                onClick={() => setShowEditModal(true)}
                className="h-11 px-6 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all hover:shadow-lg cursor-pointer"
              >
                Edit
              </button>

              {/* Archive Button */}
              <button
                onClick={() => setShowArchiveModal(true)}
                className="h-11 px-6 bg-white border border-[#D1D5DB] text-[#6B7280] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all cursor-pointer"
              >
                Archive
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PART 30: Field Header */}
      <div className="mb-8 bg-white border border-[#E5E7EB] rounded-2xl p-10 shadow-sm">
        <div className="flex items-center gap-8">
          {/* Icon */}
          <div className="w-24 h-24 bg-[#E8F5E9] rounded-full flex items-center justify-center shrink-0">
            <MapPin size={48} className="text-[#4CAF50]" strokeWidth={2} />
          </div>

          {/* Field Info */}
          <div>
            <div className="flex items-center gap-4">
              <h1
                className="font-bold text-[#1F2937]"
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "32px" }}
              >
                Field A
              </h1>
              <span className="px-4 py-2 bg-[#D4EDDA] text-[#155724] rounded-xl font-bold text-[15px]">
                Growing
              </span>
            </div>
            <p className="mt-3 text-[#6B7280] text-[18px]">
              12 hectares • Wheat
            </p>
          </div>
        </div>
      </div>

      {/* PART 31: Information Cards (2 Columns) */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Left Card: Basic Details */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
          <h2
            className="font-semibold text-[#1F2937] text-[22px] mb-6"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Basic Details
          </h2>

          <div className="space-y-5">
            <div>
              <div className="font-semibold text-[#374151] text-[16px] mb-2">
                Size
              </div>
              <div className="text-[#6B7280] text-[15px]">12 hectares</div>
            </div>

            <div>
              <div className="font-semibold text-[#374151] text-[16px] mb-2">
                Crop Type
              </div>
              <div className="text-[#6B7280] text-[15px]">Wheat</div>
            </div>

            <div>
              <div className="font-semibold text-[#374151] text-[16px] mb-2">
                Status
              </div>
              <div className="text-[#6B7280] text-[15px]">Growing</div>
            </div>

            <div>
              <div className="font-semibold text-[#374151] text-[16px] mb-2">
                Location
              </div>
              <div className="text-[#6B7280] text-[15px]">North Plot</div>
            </div>

            {/* Progress Section */}
            <div className="mt-8 pt-4 border-t border-[#E5E7EB]">
              <div className="font-semibold text-[#374151] text-[16px] mb-3">
                Progress: 80%
              </div>
              <div className="w-full h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#81C784] to-[#4CAF50] rounded-full transition-all"
                  style={{ width: "80%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Timeline */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
          <h2
            className="font-semibold text-[#1F2937] text-[22px] mb-6"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Timeline
          </h2>

          <div className="space-y-5">
            <div>
              <div className="font-semibold text-[#374151] text-[16px] mb-2">
                Planted
              </div>
              <div className="text-[#6B7280] text-[15px]">Jan 15, 2025</div>
            </div>

            <div>
              <div className="font-semibold text-[#374151] text-[16px] mb-2">
                Expected Harvest
              </div>
              <div className="text-[#6B7280] text-[15px]">May 20, 2025</div>
            </div>

            <div>
              <div className="font-semibold text-[#374151] text-[16px] mb-2">
                Days Left
              </div>
              <div className="text-[#6B7280] text-[15px]">45 days</div>
            </div>

            {/* Progress Timeline Visual */}
            <div className="mt-8 pt-4 border-t border-[#E5E7EB]">
              <div className="font-semibold text-[#374151] text-[16px] mb-4">
                Progress Timeline
              </div>
              <div className="relative">
                {/* Timeline line and dots */}
                <div className="flex items-center justify-between mb-2">
                  {/* Plant */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-4 h-4 bg-[#4CAF50] rounded-full"></div>
                    <span className="mt-2 text-[#6B7280] text-[13px] font-medium">
                      Plant
                    </span>
                  </div>
                  <div className="flex-1 h-1 bg-[#4CAF50] -mx-1"></div>

                  {/* Grow */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-4 h-4 bg-[#4CAF50] rounded-full"></div>
                    <span className="mt-2 text-[#6B7280] text-[13px] font-medium">
                      Grow
                    </span>
                  </div>
                  <div className="flex-1 h-1 bg-[#4CAF50] -mx-1"></div>

                  {/* Active */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-4 h-4 bg-[#4CAF50] rounded-full"></div>
                    <span className="mt-2 text-[#6B7280] text-[13px] font-medium">
                      Active
                    </span>
                  </div>
                  <div className="flex-1 h-1 bg-[#D1D5DB] -mx-1"></div>

                  {/* Harvest */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-4 h-4 bg-[#D1D5DB] rounded-full"></div>
                    <span className="mt-2 text-[#9CA3AF] text-[13px] font-medium">
                      Harvest
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PART 32: Active Tasks Section - Admin/Farmer only */}
      {isAdmin && (
        <div className="mt-8">
          <h2
            className="font-semibold text-[#1F2937] mb-6"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px" }}
          >
            Active Tasks (5 tasks)
          </h2>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            {/* Task 1 */}
            <div className="py-5 border-b border-[#F3F4F6]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#DBEAFE] rounded-full flex items-center justify-center shrink-0">
                  <Droplet size={24} className="text-[#3B82F6]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1F2937] mb-2 text-[17px]">
                    Water irrigation system
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#6B7280] text-[15px]">
                      Due: Today • Assigned: Ahmed, Sara •
                    </span>
                    <span className="px-3 py-1.5 bg-[#DBEAFE] text-[#1E40AF] rounded-lg font-semibold text-[14px]">
                      In Progress
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Task 2 */}
            <div className="py-5 border-b border-[#F3F4F6]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FEF3C7] rounded-full flex items-center justify-center shrink-0">
                  <Leaf size={24} className="text-[#F59E0B]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1F2937] mb-2 text-[17px]">
                    Apply fertilizer
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#6B7280] text-[15px]">
                      Due: Tomorrow • Assigned: Ali •
                    </span>
                    <span className="px-3 py-1.5 bg-[#FEF3C7] text-[#92400E] rounded-lg font-semibold text-[14px]">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Task 3 */}
            <div className="py-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FEE2E2] rounded-full flex items-center justify-center shrink-0">
                  <Bug size={24} className="text-[#EF4444]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1F2937] mb-2 text-[17px]">
                    Pest control inspection
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#6B7280] text-[15px]">
                      Due: In 2 days • Assigned: Ahmed, Sara, Ali •
                    </span>
                    <span className="px-3 py-1.5 bg-[#FEF3C7] text-[#92400E] rounded-lg font-semibold text-[14px]">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Create New Task Button - Farmer/Admin only */}
            {isAdmin && (
              <button
                onClick={() => setShowCreateTaskModal(true)}
                className="mt-5 h-11 px-6 bg-white border-2 border-[#4CAF50] text-[#4CAF50] rounded-lg font-semibold hover:bg-[#F0F9F1] transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus size={18} />
                Create New Task
              </button>
            )}
          </div>
        </div>
      )}

      {/* PART 33: Assigned Workers Section - Admin/Farmer only */}
      {isAdmin && (
        <div className="mt-8">
          <h2
            className="font-semibold text-[#1F2937] mb-6"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px" }}
          >
            Assigned Workers (3 workers)
          </h2>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            {/* Worker 1 */}
            <div className="py-5 border-b border-[#F3F4F6] flex items-center gap-5">
              <div className="relative">
                <div className="w-14 h-14 bg-linear-to-br from-[#4CAF50] to-[#388E3C] rounded-full flex items-center justify-center text-white font-bold text-[16px]">
                  AK
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4CAF50] rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold text-[#1F2937] text-[17px]">
                  Ahmed Khalil
                </h3>
                <p className="text-[#6B7280] mt-1.5 text-[15px]">
                  5 tasks assigned • 4 completed
                </p>
              </div>
            </div>

            {/* Worker 2 */}
            <div className="py-5 border-b border-[#F3F4F6] flex items-center gap-5">
              <div className="relative">
                <div className="w-14 h-14 bg-linear-to-br from-[#4CAF50] to-[#388E3C] rounded-full flex items-center justify-center text-white font-bold text-[16px]">
                  SM
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4CAF50] rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold text-[#1F2937] text-[17px]">
                  Sara Mansouri
                </h3>
                <p className="text-[#6B7280] mt-1.5 text-[15px]">
                  3 tasks assigned • 3 completed
                </p>
              </div>
            </div>

            {/* Worker 3 */}
            <div className="py-5 flex items-center gap-5">
              <div className="relative">
                <div className="w-14 h-14 bg-linear-to-br from-[#4CAF50] to-[#388E3C] rounded-full flex items-center justify-center text-white font-bold text-[16px]">
                  AB
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4CAF50] rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold text-[#1F2937] text-[17px]">
                  Ali Benali
                </h3>
                <p className="text-[#6B7280] mt-1.5 text-[15px]">
                  2 tasks assigned • 1 completed
                </p>
              </div>
            </div>

            {/* Assign More Workers Button - Farmer/Admin only */}
            {isAdmin && (
              <button
                onClick={() => setShowAssignWorkersModal(true)}
                className="mt-5 h-11 px-6 bg-white border-2 border-[#4CAF50] text-[#4CAF50] rounded-lg font-semibold hover:bg-[#F0F9F1] transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus size={18} />
                Assign More Workers
              </button>
            )}
          </div>
        </div>
      )}

      {/* PART 34: Field History Section - Admin/Farmer only */}
      {isAdmin && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-semibold text-[#1F2937]"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "24px" }}
            >
              Field History
            </h2>
            <button
              onClick={() => router.push(`/fields/${id}/history`)}
              className="text-[#4CAF50] font-semibold flex items-center gap-1 hover:underline cursor-pointer text-[15px]"
            >
              View Full History
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            {/* History 1 */}
            <div className="py-5 border-b border-[#F3F4F6] flex items-start gap-5">
              <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center shrink-0">
                <Calendar size={24} className="text-[#4CAF50]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1F2937] text-[17px]">
                  Jan 15, 2025
                </h3>
                <p className="text-[#6B7280] mt-2 text-[15px]">
                  Status changed from Idle to Planted
                </p>
                <p className="text-[#9CA3AF] mt-1.5 text-[14px]">
                  Crop: Wheat planted by Ahmed Khalil
                </p>
              </div>
            </div>

            {/* History 2 */}
            <div className="py-5 border-b border-[#F3F4F6] flex items-start gap-5">
              <div className="w-12 h-12 bg-[#DBEAFE] rounded-full flex items-center justify-center shrink-0">
                <Edit2 size={24} className="text-[#3B82F6]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1F2937] text-[17px]">
                  Jan 10, 2025
                </h3>
                <p className="text-[#6B7280] mt-2 text-[15px]">
                  Field details updated by Admin
                </p>
                <p className="text-[#9CA3AF] mt-1.5 text-[14px]">
                  Size changed from 10ha to 12ha
                </p>
              </div>
            </div>

            {/* History 3 */}
            <div className="py-5 flex items-start gap-5">
              <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center shrink-0">
                <Plus size={24} className="text-[#4CAF50]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1F2937] text-[17px]">
                  Jan 5, 2025
                </h3>
                <p className="text-[#6B7280] mt-2 text-[15px]">
                  Field created by Admin
                </p>
                <p className="text-[#9CA3AF] mt-1.5 text-[14px]">
                  Initial setup completed
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showEditModal && (
        <EditFieldModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          fieldData={{
            name: "Field A",
            size: "12",
            location: "North Plot",
            cropType: "wheat",
            status: "growing",
            plantingDate: "2025-01-15",
            harvestDate: "2025-05-20",
            description: "Primary wheat field with advanced irrigation system",
          }}
        />
      )}

      {showArchiveModal && (
        <ArchiveFieldModal
          isOpen={showArchiveModal}
          onClose={() => setShowArchiveModal(false)}
          fieldName="Field A"
        />
      )}

      {showCreateTaskModal && (
        <CreateTaskModal
          isOpen={showCreateTaskModal}
          onClose={() => setShowCreateTaskModal(false)}
          fieldName="Field A"
        />
      )}
    </>
  );
}
