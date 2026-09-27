import {
  CalendarDays,
  Video,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function UpcomingInterviews({
  interviews = [],
}) {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "";

    const interviewDate = new Date(
      `${date}T00:00:00`
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (
      interviewDate.getTime() === today.getTime()
    ) {
      return "Today";
    }

    if (
      interviewDate.getTime() === tomorrow.getTime()
    ) {
      return "Tomorrow";
    }

    return interviewDate.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-md">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming Interviews
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Don't miss your schedule
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
          <CalendarDays
            size={18}
            className="text-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">

        {interviews.length === 0 ? (
          /* Empty State */
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
              <CalendarDays
                size={23}
                className="text-blue-500"
              />
            </div>

            <h3 className="text-sm font-semibold text-gray-800">
              No upcoming interviews
            </h3>

            <p className="mt-1 max-w-[220px] text-xs leading-5 text-gray-500">
              Your scheduled interviews will appear here.
            </p>

          </div>
        ) : (
          /* Interview List */
          <div className="space-y-3">
            {interviews.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate("/interviews")}
                className="cursor-pointer rounded-xl border border-gray-100 p-3 transition hover:border-blue-200 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {item.company}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {item.interviewType || "Interview"}
                    </p>
                  </div>

                  <Video
                    size={17}
                    className="text-blue-500"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">

                  <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">
                    {formatDate(item.interviewDate)}
                  </span>

                  <span className="font-medium text-gray-600">
                    {formatTime(item.interviewTime)}
                  </span>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* View Schedule */}
      <button
        onClick={() => navigate("/interviews")}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
      >
        View Schedule
        <ArrowRight size={16} />
      </button>

    </div>
  );
}