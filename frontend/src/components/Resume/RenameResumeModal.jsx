import { useState } from "react";

export default function RenameResumeModal({
  resume,
  onClose,
  onRename,
}) {
  const [title, setTitle] = useState(resume.title);
  const [renaming, setRenaming] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please enter a resume title.");
      return;
    }

    try {
      setRenaming(true);

      await onRename(title.trim());
    } finally {
      setRenaming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-800">
          Rename Resume
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Update the title of your resume.
        </p>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          autoFocus
          className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={renaming}
            className="rounded-xl border border-slate-300 px-5 py-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={renaming}
            className="rounded-xl bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {renaming ? "Renaming..." : "Rename"}
          </button>
        </div>
      </div>
    </div>
  );
}