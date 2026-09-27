import { CheckCircle2 } from "lucide-react";

export default function NeedsAttention({ tasks = [] }) {

  const getPriorityStyle = (type) => {
    switch (type) {
      case "deadline":
        return "bg-red-500";

      case "assessment":
        return "bg-blue-500";

      case "interview":
        return "bg-green-500";

      default:
        return "bg-gray-400";
    }
  };

  const getTaskTitle = (type) => {
    switch (type) {
      case "deadline":
        return "Assessment Deadline";

      case "assessment":
        return "Assessment";

      case "interview":
        return "Interview Scheduled";

      default:
        return "Application Update";
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

    return "";
  };

  /*
   * If an application has an assessment deadline,
   * show only the deadline and hide the assessment item
   * for that same application.
   */
  const visibleTasks = tasks.filter((task) => {
    if (task.type !== "assessment") {
      return true;
    }

    const hasDeadline = tasks.some(
      (otherTask) =>
        otherTask.id === task.id &&
        otherTask.type === "deadline" &&
        otherTask.deadlineDate
    );

    return !hasDeadline;
  });

  const displayedTasks = visibleTasks.slice(0, 4);

  return (
    <div className="flex h-full w-full flex-col rounded-2xl bg-white p-6 shadow-md">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Needs Attention
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Things that need your attention
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">

        {displayedTasks.length === 0 ? (
          /* Empty State */
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2
                size={23}
                className="text-green-500"
              />
            </div>

            <h3 className="text-sm font-semibold text-gray-800">
              You're all caught up
            </h3>

            <p className="mt-1 max-w-[220px] text-xs leading-5 text-gray-500">
              No applications currently need your attention.
            </p>

          </div>
        ) : (
          <>
            {/* Tasks */}
            <div className="space-y-2">

              {displayedTasks.map((task, index) => (
                <div
                  key={`${task.id}-${task.type}-${index}`}
                  className="rounded-xl border border-gray-100 px-3 py-3 transition-colors duration-200 hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">

                    {/* Priority Dot */}
                    <div
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${getPriorityStyle(
                        task.type
                      )}`}
                    />

                    {/* Content */}
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {getTaskTitle(task.type)}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {task.company} • {getTime(task)}
                      </p>
                    </div>

                  </div>
                </div>
              ))}

            </div>

          </>
        )}

      </div>
    </div>
  );
}