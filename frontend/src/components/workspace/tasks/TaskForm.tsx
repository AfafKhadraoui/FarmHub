// src/components/workspace/tasks/TaskForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Modal } from "@/components/workspace/modals/Modal";
import { getWorkers } from "@/services/worker.service";
import { fieldService } from "@/services/field.service";
import { Loader2 } from "lucide-react";

interface TaskFormProps {
  onSubmit: (data: any) => void;
  initialData?: {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    dueDate?: string;
    fieldId?: string;
    assignedWorkerIds?: number[];
  };
  submitText?: string;
}

export function TaskForm({
  onSubmit,
  initialData,
  submitText = "Create Task",
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    initialData?.priority || "medium"
  );
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [fieldId, setFieldId] = useState(initialData?.fieldId || "");
  const [assignedWorkerIds, setAssignedWorkerIds] = useState<number[]>(
    initialData?.assignedWorkerIds || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State for fetching real data
  const [fields, setFields] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch fields and workers from the farm
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);

        // Fetch fields from the current farm
        const fieldsResponse = await fieldService.getAll(1, 100); // Get up to 100 fields
        const fieldsData = fieldsResponse.data || [];
        setFields(
          fieldsData.map((f: any) => ({
            id: f.id,
            name: f.name,
            size: f.size,
            cropType: f.cropType,
          }))
        );

        // Fetch workers from the current farm
        const workersResponse = await getWorkers({ page: 1, limit: 100 }); // Get up to 100 workers
        const workersData = workersResponse.items || [];
        setWorkers(
          workersData.map((w: any) => ({
            id: w.id,
            name: w.name,
            initials:
              w.avatarInitials ||
              w.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2),
          }))
        );
      } catch (error) {
        console.error("Error fetching fields/workers:", error);
        // Set empty arrays on error
        setFields([]);
        setWorkers([]);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const [showWorkersPanel, setShowWorkersPanel] = useState(false);
  const [workerSearch, setWorkerSearch] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Comprehensive Validation
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = "Task title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (title.trim().length > 100) {
      newErrors.title = "Title is too long (max 100 characters)";
    }

    // Due date validation
    if (!dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(dueDate);
      const now = new Date();

      // Check if date is in the past (with 1 minute tolerance)
      if (selectedDate.getTime() < now.getTime() - 60000) {
        newErrors.dueDate = "Due date cannot be in the past";
      }

      // Check if date is too far in future (more than 1 year)
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      if (selectedDate > oneYearFromNow) {
        newErrors.dueDate = "Due date cannot be more than 1 year in the future";
      }
    }

    // Description validation (optional but if provided, check length)
    if (description && description.length > 500) {
      newErrors.description = "Description is too long (max 500 characters)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    await onSubmit({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      fieldId: fieldId ? Number(fieldId) : null,
      assignedWorkerIds,
    });
    setIsSubmitting(false);
  };

  // Show loading state while fetching data
  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        <p className="text-sm text-gray-600">Loading fields and workers...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div>
        <Label
          htmlFor="title"
          className="text-sm font-semibold mb-2 block"
          style={{ color: "var(--admin-text-dark)" }}
        >
          Task Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({ ...errors, title: "" });
          }}
          placeholder="Water irrigation system - Field A"
          required
          className={`h-12 rounded-xl ${errors.title ? "border-red-500" : ""}`}
          style={{
            borderColor: errors.title ? "#ef4444" : "var(--admin-border)",
            color: "var(--admin-text-dark)",
          }}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <Label
          htmlFor="description"
          className="text-sm font-semibold mb-2 block"
          style={{ color: "var(--admin-text-dark)" }}
        >
          Description{" "}
          <span className="text-xs text-gray-500">
            (optional, max 500 chars)
          </span>
        </Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors({ ...errors, description: "" });
          }}
          placeholder="Describe what needs to be done..."
          rows={4}
          maxLength={500}
          className={`w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 transition-all ${
            errors.description ? "border-red-500" : ""
          }`}
          style={
            {
              borderColor: errors.description
                ? "#ef4444"
                : "var(--admin-border)",
              color: "var(--admin-text-dark)",
              backgroundColor: "white",
              "--tw-ring-color": "var(--admin-primary)",
            } as React.CSSProperties
          }
          onFocus={(e) => {
            if (!errors.description)
              e.target.style.borderColor = "var(--admin-primary)";
          }}
          onBlur={(e) => {
            if (!errors.description)
              e.target.style.borderColor = "var(--admin-border)";
          }}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {description.length}/500 characters
        </p>
      </div>

      {/* Priority and Due Date Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label
            className="text-sm font-semibold mb-2 block"
            style={{ color: "var(--admin-text-dark)" }}
          >
            Priority <span className="text-red-500">*</span>
          </Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
            <SelectTrigger
              className="h-12 rounded-xl"
              style={{
                borderColor: "var(--admin-border)",
                color: "var(--admin-text-dark)",
              }}
            >
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label
            htmlFor="dueDate"
            className="text-sm font-semibold mb-2 block"
            style={{ color: "var(--admin-text-dark)" }}
          >
            Due Date & Time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dueDate"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              if (errors.dueDate) setErrors({ ...errors, dueDate: "" });
            }}
            required
            className={`h-12 rounded-xl ${
              errors.dueDate ? "border-red-500" : ""
            }`}
            style={{
              borderColor: errors.dueDate ? "#ef4444" : "var(--admin-border)",
              color: "var(--admin-text-dark)",
            }}
          />
          {errors.dueDate && (
            <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>
          )}
        </div>
      </div>

      {/* Field selection panel */}
      <div>
        <Label
          className="text-sm font-semibold mb-2 block"
          style={{ color: "var(--admin-text-dark)" }}
        >
          Field (optional)
        </Label>
        {fields.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 px-4 bg-gray-50 rounded-lg">
            No fields available. Create a field first to assign tasks.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {fields.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFieldId(String(f.id))}
                className={`text-left p-4 rounded-lg border hover:shadow transition-all ${
                  fieldId === String(f.id)
                    ? "border-[#4CAF50] bg-[#F0F9F1]"
                    : "border-[#E5E7EB] bg-white"
                }`}
              >
                <div className="font-semibold text-[#1F2937]">{f.name}</div>
                <div className="text-[#6B7280] text-sm">
                  {f.cropType} • {f.size} ha
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Workers assignment opens a panel due to large worker lists */}
      <div>
        <Label
          className="text-sm font-semibold mb-2 block"
          style={{ color: "var(--admin-text-dark)" }}
        >
          Assign Workers
        </Label>

        {workers.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 px-4 bg-gray-50 rounded-lg">
            No workers available in your farm. Invite workers using the farm
            join code.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                className="h-11 px-4"
                onClick={() => setShowWorkersPanel(true)}
              >
                Select Workers
              </Button>
              <div className="flex items-center gap-2 flex-wrap">
                {assignedWorkerIds.length === 0 ? (
                  <span className="text-sm text-[#6B7280]">
                    No workers selected
                  </span>
                ) : (
                  workers
                    .filter((w) => assignedWorkerIds.includes(w.id))
                    .map((w) => (
                      <span
                        key={w.id}
                        className="inline-flex items-center gap-2 bg-[#F0F9F1] text-[#065f46] px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {w.initials} {w.name}
                        <button
                          type="button"
                          onClick={() =>
                            setAssignedWorkerIds((prev) =>
                              prev.filter((id) => id !== w.id)
                            )
                          }
                          className="ml-2 text-[#065f46] opacity-80"
                        >
                          ×
                        </button>
                      </span>
                    ))
                )}
              </div>
            </div>
          </>
        )}

        <Modal
          isOpen={showWorkersPanel}
          onClose={() => setShowWorkersPanel(false)}
          title="Select Workers"
          subtitle={`Choose workers from your farm to assign to this task (${workers.length} available)`}
          width="720px"
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowWorkersPanel(false)}
                className="h-11 px-6 bg-white border border-[#D1D5DB] text-[#4B5563] rounded-lg font-semibold hover:bg-[#F9FAFB] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowWorkersPanel(false)}
                className="h-11 px-6 bg-[#4CAF50] text-white rounded-lg font-semibold hover:bg-[#388E3C] transition-all"
              >
                Save
              </button>
            </>
          }
        >
          <div className="mb-4">
            <input
              type="search"
              value={workerSearch}
              onChange={(e) => setWorkerSearch(e.target.value)}
              placeholder="Search workers by name or initials"
              className="w-full h-11 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto">
            {workers
              .filter(
                (w) =>
                  w.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
                  w.initials.toLowerCase().includes(workerSearch.toLowerCase())
              )
              .map((worker) => {
                const selected = assignedWorkerIds.includes(worker.id);
                return (
                  <label
                    key={worker.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selected
                        ? "bg-[#F0F9F1] border border-[#4CAF50]"
                        : "hover:bg-[#F9FAFB] border border-transparent"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => {
                        if (selected)
                          setAssignedWorkerIds((prev) =>
                            prev.filter((id) => id !== worker.id)
                          );
                        else
                          setAssignedWorkerIds((prev) => [...prev, worker.id]);
                      }}
                      className="w-4 h-4 text-[#4CAF50]"
                    />
                    <div className="w-9 h-9 rounded-full bg-[#4CAF50] text-white flex items-center justify-center font-semibold">
                      {worker.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-[#1F2937]">
                        {worker.name}
                      </div>
                      <div className="text-sm text-[#6B7280]">Worker</div>
                    </div>
                  </label>
                );
              })}
            {workers.filter(
              (w) =>
                w.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
                w.initials.toLowerCase().includes(workerSearch.toLowerCase())
            ).length === 0 && (
              <p className="col-span-2 text-center text-gray-500 py-8">
                No workers found matching "{workerSearch}"
              </p>
            )}
          </div>
        </Modal>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full h-12 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--admin-primary)" }}
          disabled={isSubmitting || !title || !dueDate}
        >
          {isSubmitting ? "Saving..." : submitText}
        </Button>
      </div>
    </form>
  );
}
