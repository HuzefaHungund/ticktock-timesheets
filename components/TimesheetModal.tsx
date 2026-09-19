"use client";

import { useState, useEffect } from "react";
import { Timesheet } from "@/app/api/timesheets/route";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Partial<Timesheet>) => void;
  initialData?: Timesheet | null;
  mode: "create" | "update" | "view";
}

export default function TimesheetModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}: ModalProps) {
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [dateRange, setDateRange] = useState("");
  const [status, setStatus] = useState<Timesheet["status"]>("INCOMPLETE");

  useEffect(() => {
    if (initialData) {
      setWeekNumber(initialData.weekNumber);
      setDateRange(initialData.dateRange);
      setStatus(initialData.status);
    } else {
      setWeekNumber(1);
      setDateRange("");
      setStatus("INCOMPLETE");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") return onClose();

    onSave({
      id: initialData?.id,
      weekNumber,
      dateRange,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-gray-900">
            {mode === "create" && "Create Timesheet"}
            {mode === "update" && "Update Timesheet"}
            {mode === "view" && "View Timesheet"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700">Week #</label>
            <input
              type="number"
              min="1"
              max="53"
              disabled={mode === "view"}
              value={weekNumber}
              onChange={(e) => setWeekNumber(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm disabled:bg-gray-50 focus:border-blue-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Date Range</label>
            <input
              type="text"
              placeholder="e.g. 1 - 5 January, 2024"
              disabled={mode === "view"}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm disabled:bg-gray-50 focus:border-blue-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">Status</label>
            <select
              disabled={mode === "view"}
              value={status}
              onChange={(e) => setStatus(e.target.value as Timesheet["status"])}
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 text-sm disabled:bg-gray-50 focus:border-blue-600 focus:outline-none"
            >
              <option value="COMPLETED">COMPLETED</option>
              <option value="INCOMPLETE">INCOMPLETE</option>
              <option value="MISSING">MISSING</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md"
            >
              {mode === "view" ? "Close" : "Cancel"}
            </button>
            {mode !== "view" && (
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-md"
              >
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}