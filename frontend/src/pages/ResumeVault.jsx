import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Upload,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";
import RenameResumeModal from "../components/Resume/RenameResumeModal";

const API_URL = "https://jobtrack-ai-4dnt.onrender.com";

export default function ResumeVault() {
  const [resumes, setResumes] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const mapResume = (resume) => ({
    id: resume.id,
    title: resume.title,
    fileName: resume.originalFileName,
    uploaded: new Date(resume.uploadedAt),
  });

  const fetchResumes = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch resumes.");
      }

      const data = await response.json();

      setResumes(data.map(mapResume));
    } catch (error) {
      console.error("Fetch resumes error:", error);
      alert("Unable to load resumes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // Open the selected PDF in a new browser tab
  const handleOpenResume = async (id) => {
    const newTab = window.open("", "_blank");

    if (!newTab) {
      alert("Please allow pop-ups to open your resume.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to open resume.");
      }

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);

      newTab.location.href = fileUrl;

      setTimeout(() => {
        URL.revokeObjectURL(fileUrl);
      }, 60000);
    } catch (error) {
      newTab.close();

      console.error("Open resume error:", error);
      alert("Unable to open this resume.");
    }
  };

  const handleUpload = async () => {
    if (!resumeTitle.trim() || !selectedFile) {
      alert("Please enter a resume title and choose a file.");
      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("title", resumeTitle.trim());
      formData.append("file", selectedFile);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Resume upload failed.");
      }

      const uploadedResume = await response.json();

      setResumes((prev) => [mapResume(uploadedResume), ...prev]);

      setResumeTitle("");
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setShowModal(false);
    } catch (error) {
      console.error("Upload resume error:", error);
      alert(error.message || "Unable to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleRenameResume = async (newTitle) => {
    if (!selectedResume) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${selectedResume.id}?title=${encodeURIComponent(
          newTitle.trim()
        )}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to rename resume.");
      }

      const updatedResume = await response.json();

      setResumes((prev) =>
        prev.map((resume) =>
          resume.id === selectedResume.id
            ? mapResume(updatedResume)
            : resume
        )
      );

      setShowRenameModal(false);
      setSelectedResume(null);
    } catch (error) {
      console.error("Rename resume error:", error);
      alert(error.message || "Unable to rename resume.");
    }
  };

  const handleDeleteResume = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to delete resume.");
      }

      setResumes((prev) => prev.filter((resume) => resume.id !== id));
    } catch (error) {
      console.error("Delete resume error:", error);
      alert(error.message || "Unable to delete resume.");
    }
  };

  const sortedResumes = useMemo(() => {
    const filtered = resumes.filter(
      (resume) =>
        resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resume.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      if (sortOrder === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortOrder === "oldest") {
        return a.uploaded - b.uploaded;
      }

      return b.uploaded - a.uploaded;
    });
  }, [resumes, searchQuery, sortOrder]);

  return (
    <div className="p-8">
      {/* Hero Section */}
      <div className="mb-2 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-8 shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mt-2 text-5xl font-bold text-white">
              📄 Resume Vault
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-blue-100">
              Organize multiple resume versions, prepare role-specific
              resumes, and keep every application ready with your personal
              resume library.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-semibold text-blue-600 shadow-md transition hover:scale-105"
          >
            <Upload size={20} />
            Upload Resume
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="mb-3 rounded-2xl bg-white p-2 shadow-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-lg">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, filename or job role..."
              className="w-full rounded-xl border border-slate-300 bg-gray-50 py-1 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="rounded-xl border border-slate-300 bg-gray-50 px-5 py-1 outline-none transition hover:bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">A → Z</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="mt-10 text-center text-gray-500">
          <FileText
            size={50}
            className="mx-auto mb-4 animate-pulse text-gray-400"
          />
          <p className="font-medium">Loading resumes...</p>
        </div>
      ) : sortedResumes.length > 0 ? (
        /* Resume Grid */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {sortedResumes.map((resume) => (
            <div
              key={resume.id}
              onClick={() => handleOpenResume(resume.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleOpenResume(resume.id);
                }
              }}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl"
            >
              {/* Resume PDF Icon */}
              <div className="mb-5 flex justify-center">
                <div className="rounded-2xl bg-red-50 p-5 transition group-hover:bg-red-100">
                  <FileText size={70} className="text-red-500" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-center text-lg font-semibold text-gray-800">
                {resume.title}
              </h2>

              {/* File Name */}
              <p className="mt-2 truncate text-center text-sm text-gray-500">
                {resume.fileName}
              </p>

              {/* Actions */}
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    setSelectedResume(resume);
                    setShowRenameModal(true);
                  }}
                  className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                  title="Rename resume"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteResume(resume.id);
                  }}
                  className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                  title="Delete resume"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Upload Date */}
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-center text-xs text-gray-400">
                  Uploaded •{" "}
                  {resume.uploaded.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="mt-10 text-center text-gray-500">
          <FileText size={50} className="mx-auto mb-4 text-gray-400" />
          <p className="font-medium">No resumes found</p>
          <p className="text-sm">
            Try changing your search or upload a new resume.
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Upload Resume
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Resume Title
                </label>

                <input
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  placeholder="e.g. Frontend Developer Resume"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Upload Resume
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full rounded-xl border border-slate-300 p-3"
                />

                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setResumeTitle("");
                  setSelectedFile(null);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="rounded-xl border border-slate-300 px-6 py-3 transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload Resume"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRenameModal && selectedResume && (
        <RenameResumeModal
          resume={selectedResume}
          onClose={() => {
            setShowRenameModal(false);
            setSelectedResume(null);
          }}
          onRename={handleRenameResume}
        />
      )}
    </div>
  );
}