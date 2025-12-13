import React, { useState } from "react";
import { Modal } from "./Modal";
import { CheckCircle, Upload } from "lucide-react";

interface CompleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskName?: string;
}

export function CompleteTaskModal({
  isOpen,
  onClose,
  taskName = "Water irrigation system - Field A",
}: CompleteTaskModalProps) {
  const [notes, setNotes] = useState("");
  const [checklist, setChecklist] = useState([
    { id: 1, label: "All irrigation lines checked", checked: true },
    { id: 2, label: "Equipment cleaned and stored", checked: true },
    { id: 3, label: "Area inspected", checked: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChecklistToggle = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleComplete = async () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onClose();
      (window as any).showToast?.("Task marked as complete!", "success");
      setNotes("");
    }, 1000);
  };

  const allChecklistDone = checklist.every((item) => item.checked);

  const footer = (
    <>
      <button
        onClick={onClose}
        className="h-11 px-6 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all"
      >
        Go Back
      </button>
      <button
        onClick={handleComplete}
        disabled={isLoading}
        className="h-11 px-6 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        Mark Complete
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Task?"
      footer={footer}
      width="500px"
    >
      <div className="space-y-6">
        {/* Task Name */}
        <div className="bg-[#E8F5E9] border border-[#4CAF50] rounded-lg p-4">
          <p className="font-semibold text-[#1F2937]">{taskName}</p>
        </div>

        {/* Confirmation */}
        <div>
          <p className="text-[#374151]">Are you sure this task is completed?</p>
        </div>

        {/* Completion Notes */}
        <div>
          <label className="block font-medium text-[#374151] mb-2">
            Completion Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any final notes or observations..."
            rows={4}
            className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent resize-none"
          />
        </div>

        {/* Checklist */}
        <div>
          <label className="block font-medium text-[#374151] mb-3">
            Checklist
          </label>
          <div className="space-y-2">
            {checklist.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg cursor-pointer hover:bg-[#F3F4F6] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleChecklistToggle(item.id)}
                  className="w-5 h-5 text-[#4CAF50] focus:ring-[#4CAF50] rounded"
                />
                <span
                  className={`flex-1 ${
                    item.checked
                      ? "text-[#6B7280] line-through"
                      : "text-[#374151]"
                  }`}
                >
                  {item.label}
                </span>
              </label>
            ))}
          </div>

          {!allChecklistDone && (
            <p className="text-[#F59E0B] text-[13px] mt-2 flex items-center gap-1">
              ⚠️ Complete all checklist items before marking as done
            </p>
          )}
        </div>

        {/* Photo Upload (Optional) */}
        <div>
          <label className="block font-medium text-[#374151] mb-2">
            Final Photos (Optional)
          </label>
          <button
            type="button"
            className="w-full h-12 border-2 border-dashed border-[#D1D5DB] rounded-lg flex items-center justify-center gap-2 text-[#6B7280] hover:border-[#4CAF50] hover:text-[#4CAF50] transition-colors"
          >
            <Upload size={20} />
            Upload Photos
          </button>
        </div>
      </div>
    </Modal>
  );
}
