export default function NeedsAttention({ tasks = [] }) {

  const getPriorityStyle = (type, status) => {
    switch (type) {
      case "deadline":
        return "bg-red-500";

      case "assessment":
        return "bg-orange-500";

      case "interview":
        return "bg-green-500";

      default:
        switch (status) {
          case "Shortlisted":
            return "bg-blue-500";

          case "In Review":
            return "bg-orange-500";

          default:
            return "bg-gray-400";
        }
    }
  };

  const getTaskTitle = (type, status) => {
    switch (type) {
      case "deadline":
        return "Assessment Deadline";

      case "assessment":
        return "Assessment";

      case "interview":
        return "Interview Scheduled";

      default:
        switch (status) {
          case "Shortlisted":
            return "Application Shortlisted";

          case "In Review":
            return "Application Under Review";

          default:
            return "Application Update";
        }
    }
  };

  const getDateDifference = (date) => {
    if (!date) return "";

    const targetDate = new Date(
      `${date}T00:00:00`
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const difference = Math.round(
      (targetDate - today) /
        (1000 * 60 * 60 * 24)
    );

    if (difference < 0) {
      return "Overdue";
    }

    if (difference === 0) {
      return "Today";
    }

    if (difference === 1) {
      return "Tomorrow";
    }

    return `In ${difference} days`;
  };

  const getTime = (task) => {
    if (task.type === "deadline") {
      return getDateDifference(
        task.deadlineDate
      );
    }

    if (task.type === "assessment") {
      return getDateDifference(
        task.assessmentDate
      );
    }

    if (task.type === "interview") {
      return getDateDifference(
        task.interviewDate
      );
    }

    if (!task.appliedDate) {
      return "";
    }

    return new Date(
      `${task.appliedDate}T00:00:00`
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
      </div>

      <div>
        {tasks.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500">
              Nothing needs your attention.
            </p>
          </div>
        ) : (
          tasks.slice(0, 4).map((task, index) => (
            <div
              key={`${task.id}-${task.type}-${index}`}
              className={`flex items-center gap-4 py-3 transition-colors duration-200 hover:bg-gray-50 ${
                index !== Math.min(tasks.length, 4) - 1
                  ? "border-b border-gray-200"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">

                {/* Priority Dot */}
                <div
                  className={`h-3 w-3 shrink-0 rounded-full ${getPriorityStyle(
                    task.type,
                    task.status
                  )}`}
                />

                {/* Content */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {getTaskTitle(
                      task.type,
                      task.status
                    )}
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