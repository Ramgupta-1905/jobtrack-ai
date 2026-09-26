import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function AddInterviewModal({
  interview,
  onClose,
  onAdd,
}) {
  const [form, setForm] = useState({
    interviewDate: "",
    interviewTime: "",
    type: "Virtual",
    status: "Scheduled",
    outcome: "Pending",
    notes: "",
  });

  useEffect(() => {
    if (!interview) return;

    setForm({
      interviewDate: interview.interviewDate || "",
      interviewTime: interview.interviewTime || "",
      type: interview.type || "Virtual",
      status: interview.status || "Scheduled",
      outcome: interview.outcome || "Pending",
      notes: interview.notes || "",
    });
  }, [interview]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.interviewDate ||
      !form.interviewTime ||
      !form.type ||
      !form.status
    ) {
      alert("Please fill all required fields.");
      return;
    }

    onAdd({
      ...form,
      outcome:
        form.status === "Completed"
          ? form.outcome
          : null,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Edit Interview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {interview?.company} · {interview?.role}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Interview Date + Time */}
          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Interview Date
              </label>

              <input
                type="date"
                name="interviewDate"
                value={form.interviewDate}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Interview Time
              </label>

              <input
                type="time"
                name="interviewTime"
                value={form.interviewTime}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

          </div>

          {/* Interview Type */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Interview Type
            </label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            >
              <option>Virtual</option>
              <option>On-site</option>
              <option>Phone Screen</option>
              <option>HR</option>
              <option>Technical</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            >
              <option value="Scheduled">
                Scheduled
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

          {/* Outcome */}
          {form.status === "Completed" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Outcome
              </label>

              <select
                name="outcome"
                value={form.outcome}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option>Pending</option>
                <option>Offer Received</option>
                <option>Accepted</option>
                <option>Offer Declined</option>
                <option>Rejected</option>
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Notes
            </label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add notes about the interview..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Save Changes
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}