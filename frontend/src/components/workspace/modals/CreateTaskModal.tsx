import React, { useState } from "react";
import { Modal } from "./Modal";
import { Clock } from "lucide-react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName?: string;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  fieldName = "Field A",
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    dueTime: "",
    workers: [] as string[],
    category: "irrigation",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showWorkerDropdown, setShowWorkerDropdown] = useState(false);

  const workers = [
    { id: "ahmed", name: "Ahmed Khalil", initials: "AK" },
    { id: "sara", name: "Sara Mansouri", initials: "SM" },
    { id: "ali", name: "Ali Benali", initials: "AB" },
    { id: "fatima", name: "Fatima Hassan", initials: "FH" },
  ];

  const handleWorkerToggle = (workerId: string) => {
    setFormData((prev) => ({
      ...prev,
      workers: prev.workers.includes(workerId)
        ? prev.workers.filter((id) => id !== workerId)
        : [...prev.workers, workerId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      (window as any).showToast?.("Task created successfully!", "success");
      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        dueTime: "",
        workers: [],
        category: "irrigation",
      });
    }, 1000);
  };

  const isFormValid =
    formData.title && formData.dueDate && formData.workers.length > 0;

  const footer = (
    <>
      <button
        onClick={onClose}
        className="h-11 px-6 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        disabled={!isFormValid || isLoading}
        className="h-11 px-6 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        Create Task
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      subtitle={`For ${fieldName}`}
      footer={footer}
      width="700px"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Task Details */}
        <div>
          <h3 className="font-semibold text-[#1F2937] mb-4">Task Details</h3>

          {/* Task Title */}
          <div className="mb-4">
            <label className="block font-medium text-[#374151] mb-2">
              Task Title <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Water irrigation system"
              className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-[#374151] mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe what needs to be done..."
              rows={3}
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Section 2: Priority & Schedule */}
        <div>
          <h3 className="font-semibold text-[#1F2937] mb-4">
            Priority & Schedule
          </h3>

          {/* Priority */}
          <div className="mb-4">
            <label className="block font-medium text-[#374151] mb-2">
              Priority <span className="text-[#EF4444]">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="low"
                  checked={formData.priority === "low"}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-4 h-4 text-[#6B7280] focus:ring-[#6B7280]"
                />
                <span className="text-[#374151]">Low</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="medium"
                  checked={formData.priority === "medium"}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-4 h-4 text-[#FFC107] focus:ring-[#FFC107]"
                />
                <span className="text-[#374151]">Medium</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="high"
                  checked={formData.priority === "high"}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-4 h-4 text-[#EF4444] focus:ring-[#EF4444]"
                />
                <span className="text-[#374151]">High</span>
              </label>
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#374151] mb-2">
                Due Date <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block font-medium text-[#374151] mb-2">
                Due Time
              </label>
              <input
                type="time"
                value={formData.dueTime}
                onChange={(e) =>
                  setFormData({ ...formData, dueTime: e.target.value })
                }
                className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Assignment */}
        <div>
          <h3 className="font-semibold text-[#1F2937] mb-4">Assignment</h3>

          {/* Assign Workers */}
          <div>
            <label className="block font-medium text-[#374151] mb-2">
              Assign Workers <span className="text-[#EF4444]">*</span>
            </label>

            <div className="border border-[#D1D5DB] rounded-lg p-3 space-y-2">
              {workers.map((worker) => (
                <label
                  key={worker.id}
                  className="flex items-center gap-3 p-2 hover:bg-[#F9FAFB] rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.workers.includes(worker.id)}
                    onChange={() => handleWorkerToggle(worker.id)}
                    className="w-4 h-4 text-[#4CAF50] focus:ring-[#4CAF50] rounded"
                  />
                  <div className="w-8 h-8 bg-[#4CAF50] rounded-full flex items-center justify-center text-white font-semibold text-[14px]">
                    {worker.initials}
                  </div>
                  <span className="text-[#374151]">{worker.name}</span>
                </label>
              ))}
            </div>

            {formData.workers.length > 0 && (
              <p className="text-[#6B7280] text-[13px] mt-2">
                {formData.workers.length} worker
                {formData.workers.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        </div>

        {/* Section 4: Task Type */}
        <div>
          <h3 className="font-semibold text-[#1F2937] mb-4">Task Category</h3>

          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent bg-white"
          >
            <option value="irrigation">Irrigation</option>
            <option value="fertilizing">Fertilizing</option>
            <option value="harvesting">Harvesting</option>
            <option value="planting">Planting</option>
            <option value="maintenance">Maintenance</option>
            <option value="pest-control">Pest Control</option>
            <option value="other">Other</option>
          </select>
        </div>
      </form>
    </Modal>
  );
}
