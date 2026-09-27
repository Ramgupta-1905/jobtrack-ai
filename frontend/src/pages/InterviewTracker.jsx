import { useEffect, useState } from "react";
import {
  Search,
  ArrowUpDown,
  CalendarDays,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock3,
  Monitor,
  FileText,
  Pencil,
  Phone,
} from "lucide-react";

import AddInterviewModal from "../components/Interview/AddInterviewModal";

import {
  getInterviews,
  updateInterview,
} from "../services/interviewService";

export default function InterviewTracker() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filter, setFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
   * Convert backend interview response into
   * the format currently expected by our UI.
   *
   * Backend:
   * interviewDate = "2026-10-05"
   * interviewTime = "10:00:00"
   *
   * UI:
   * date = "05 Oct 2026"
   * time = "10:00 AM"
   */
  const formatInterview = (interview) => {
    const date = new Date(`${interview.interviewDate}T00:00:00`);

    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const [hours, minutes] = interview.interviewTime
      .split(":")
      .map(Number);

    const timeDate = new Date();

    timeDate.setHours(hours);
    timeDate.setMinutes(minutes);
    timeDate.setSeconds(0);

    const formattedTime = timeDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    return {
      id: interview.id,
      applicationId: interview.applicationId,

      company: interview.company,
      role: interview.role,

      date: formattedDate,
      time: formattedTime,

      // Keep original backend values for editing
      interviewDate: interview.interviewDate,
      interviewTime: interview.interviewTime.slice(0, 5),

      interviewMode: interview.interviewMode || "Virtual",
      interviewType: interview.interviewType || "Technical",

      status: interview.status,
      outcome: interview.outcome,
      notes: interview.notes || "",
    };
  };

  // Load interviews from backend
  const loadInterviews = async () => {
    try {
      setLoading(true);

      const data = await getInterviews();

      const formattedData = data.map(formatInterview);

      setInterviews(formattedData);
    } catch (error) {
      console.error("Failed to load interviews:", error);
      alert("Failed to load interviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  // Search filter
  const filteredInterviews = interviews.filter((interview) => {
    const searchText = [
      interview.company,
      interview.role,
      interview.interviewMode,
      interview.interviewType,
      interview.notes,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchText.includes(
      search.toLowerCase()
    );

    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Today"
        ? isToday(interview.interviewDate)
        : interview.status === filter;

    return matchesSearch && matchesFilter;
  });

  // Sort by date/time
  const sortedInterviews = [...filteredInterviews].sort(
    (a, b) => {
      const dateA = new Date(
        `${a.interviewDate}T${a.interviewTime}`
      );

      const dateB = new Date(
        `${b.interviewDate}T${b.interviewTime}`
      );

      return sortOrder === "asc"
        ? dateA - dateB
        : dateB - dateA;
    }
  );

  // Check whether interview date is today
  function isToday(dateString) {
    if (!dateString) return false;

    const interviewDate = new Date(
      `${dateString}T00:00:00`
    );

    const today = new Date();

    return (
      interviewDate.getFullYear() === today.getFullYear() &&
      interviewDate.getMonth() === today.getMonth() &&
      interviewDate.getDate() === today.getDate()
    );
  }

  // Dynamic stats
  const stats = [
    {
      title: "Upcoming",
      value: interviews.filter(
        (interview) => interview.status === "Scheduled"
      ).length,
      icon: CalendarDays,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Today",
      value: interviews.filter(
        (interview) =>
          isToday(interview.interviewDate)
      ).length,
      icon: CalendarCheck,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Completed",
      value: interviews.filter(
        (interview) => interview.status === "Completed"
      ).length,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Cancelled",
      value: interviews.filter(
        (interview) => interview.status === "Cancelled"
      ).length,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  // Open edit modal
  const handleEditInterview = (interview) => {
    setEditingInterview(interview);
    setIsModalOpen(true);
  };

  // Save edited interview
  const handleUpdateInterview = async (interviewData) => {
    try {
      const requestData = {
        interviewDate: interviewData.interviewDate,
        interviewTime: interviewData.interviewTime,
        interviewMode: interviewData.interviewMode,
        interviewType: interviewData.interviewType,
        status: interviewData.status,
        outcome: interviewData.outcome || null,
        notes: interviewData.notes || "",
      };

      const updatedInterview = await updateInterview(
        editingInterview.id,
        requestData
      );

      const formattedInterview =
        formatInterview(updatedInterview);

      setInterviews((prev) =>
        prev.map((interview) =>
          interview.id === editingInterview.id
            ? formattedInterview
            : interview
        )
      );

      setEditingInterview(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update interview:", error);

      alert(
        error.message || "Failed to update interview."
      );
    }
  };

  return (
    <div className="space-y-8 px-8 py-8">

      {/* Hero Section */}
      <div className="mb-2 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-8 py-6 shadow-lg">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          {/* Left */}
          <div className="flex-1">

            <h1 className="mt-2 text-5xl font-bold text-white">
              💼 Interview Tracker
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-blue-100">
              Manage technical rounds, HR interviews,
              online assessments, and keep every interview
              organized in one place.
            </p>

          </div>

        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl bg-white/15 p-5 backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <Icon size={18} className="text-white" />

                  <p className="text-sm text-blue-100">
                    {stat.title}
                  </p>
                </div>

                <h2 className="mt-1 text-3xl font-bold text-white">
                  {stat.value}
                </h2>
              </div>
            );
          })}

        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">

        <div className="relative w-full md:max-w-lg">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search interviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-1 pl-11 pr-4 outline-none transition focus:border-blue-500"
          />

        </div>

        <div className="flex items-center gap-2">

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border px-3 py-1 text-sm text-gray-700 transition focus:border-blue-500"
          >
            <option value="All">All</option>
            <option value="Scheduled">Upcoming</option>
            <option value="Today">Today</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Sort */}
          <button
            onClick={() =>
              setSortOrder(
                sortOrder === "asc"
                  ? "desc"
                  : "asc"
              )
            }
            className="rounded-xl border py-1 transition hover:bg-gray-100"
          >
            <ArrowUpDown size={18} />
          </button>

        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
          Loading interviews...
        </div>
      )}

      {/* Empty State */}
      {!loading && sortedInterviews.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

          <CalendarDays
            size={40}
            className="mx-auto text-gray-300"
          />

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No interviews found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Interviews will appear here when you schedule
            an interview from an application.
          </p>

        </div>
      )}

      {/* Interview List/Grid */}
      {!loading && sortedInterviews.length > 0 && (
        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">

          {sortedInterviews.map((interview) => (

            <div
              key={interview.id}
              className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl"
            >

              {/* Header */}
              <div className="flex items-center gap-3">

                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-600 shadow-sm">
                  {interview.company
                    ? interview.company.charAt(0)
                    : "?"}
                </div>

                <div>

                  <h3 className="text-lg font-semibold text-gray-900">
                    {interview.company}
                  </h3>

                  <p className="line-clamp-2 text-sm leading-5 text-gray-500">
                    {interview.role}
                  </p>

                </div>

              </div>

              {/* Details */}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">

                <span className="flex items-center gap-1 rounded-full border bg-white/70 px-3 py-1 text-gray-700 shadow-sm backdrop-blur-sm">
                  <CalendarDays className="h-4 w-4" />

                  {interview.date}
                </span>

                <span className="flex items-center gap-1 rounded-full border bg-white/70 px-3 py-1 text-gray-700 shadow-sm backdrop-blur-sm">
                  <Clock3 className="h-4 w-4" />

                  {interview.time}
                </span>

                <span className="flex items-center gap-1 rounded-full border bg-white/70 px-3 py-1 text-gray-700 shadow-sm backdrop-blur-sm">
                  {interview.interviewMode === "Phone" ? (
                    <Phone className="h-4 w-4" />
                  ) : (
                    <Monitor className="h-4 w-4" />
                  )}

                  {interview.interviewMode}
                </span>

                <span className="flex items-center gap-1 rounded-full border bg-white/70 px-3 py-1 text-gray-700 shadow-sm backdrop-blur-sm">
                  <FileText className="h-4 w-4" />

                  {interview.interviewType}
                </span>

              </div>

              {/* Notes */}
              <div className="mt-4 border-l-4 border-blue-200 bg-blue-50/50 p-3 text-sm text-gray-700">

                <div className="flex items-start gap-2">

                  <FileText className="mt-0.5 h-4 w-4 text-blue-500" />

                  <p className="line-clamp-2">
                    {interview.notes || "No notes added."}
                  </p>

                </div>

              </div>

              {/* Bottom Row */}
              <div className="mt-4 flex items-center justify-between">

                {/* Status + Outcome */}
                <div className="flex flex-wrap gap-2 text-xs">

                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium shadow-sm ${
                      interview.status === "Scheduled"
                        ? "bg-blue-100 text-blue-700"
                        : interview.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : interview.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {interview.status}
                  </span>

                  {interview.status === "Completed" && (
                    <span
                      className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium shadow-sm ${
                        interview.outcome === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : interview.outcome ===
                            "Offer Received"
                          ? "bg-purple-100 text-purple-700"
                          : interview.outcome ===
                            "Accepted"
                          ? "bg-green-100 text-green-700"
                          : interview.outcome ===
                            "Offer Declined"
                          ? "bg-orange-100 text-orange-700"
                          : interview.outcome ===
                            "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {interview.outcome}
                    </span>
                  )}

                </div>

                {/* Edit */}
                <div className="flex items-center gap-1">

                  <button
                    onClick={() =>
                      handleEditInterview(interview)
                    }
                    className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                  >
                    <Pencil size={18} />
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

      {/* Edit Interview Modal */}
      {isModalOpen && editingInterview && (
        <AddInterviewModal
          interview={editingInterview}
          onClose={() => {
            setIsModalOpen(false);
            setEditingInterview(null);
          }}
          onAdd={handleUpdateInterview}
        />
      )}

    </div>
  );
}