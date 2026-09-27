export default function NeedsAttention({ tasks = [] }) {
  const getPriorityStyle = (status) => {
    switch (status) {
      case "Interview Scheduled":
        return "bg-green-500";

      case "Shortlisted":
        return "bg-blue-500";

      case "In Review":
        return "bg-orange-500";

      default:
        return "bg-gray-400";
    }
  };

  const getTaskTitle = (status) => {
    switch (status) {
      case "Interview Scheduled":
        return "Interview Scheduled";

      case "Shortlisted":
        return "Application Shortlisted";

      case "In Review":
        return "Application Under Review";

      default:
        return "Application Update";
    }
  };

  const getTime = (application) => {
    if (application.interviewDate) {
      const interviewDate = new Date(
        `${application.interviewDate}T00:00:00`
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const difference =
        Math.round(
          (interviewDate - today) /
            (1000 * 60 * 60 * 24)
        );

      if (difference === 0) return "Today";
      if (difference === 1) return "Tomorrow";
      if (difference > 1) return `In ${difference} days`;

      return "Scheduled";
    }

    if (!application.appliedDate) {
      return "";
    }

    return new Date(
      `${application.appliedDate}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="h-full w-full rounded-2xl bg-white p-6 shadow-md">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Needs Attention
        </h2>

        <button className="text-sm text-blue-600 hover:underline">
          View All
        </button>
      </div>

      <div>
        {tasks.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500">
              Nothing needs your attention.
            </p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task.id}
              className={`flex items-center gap-4 py-3 transition-colors duration-200 hover:bg-gray-50 ${
                index !== tasks.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">

                <div
                  className={`h-3 w-3 rounded-full ${getPriorityStyle(
                    task.status
                  )}`}
                ></div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {getTaskTitle(task.status)}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {task.company} • {getTime(task)}
                  </p>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}