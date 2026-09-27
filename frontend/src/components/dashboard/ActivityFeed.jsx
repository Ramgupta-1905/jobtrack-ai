import { Briefcase, CircleCheckBig } from "lucide-react";

export default function ActivityFeed({ activities = [] }) {

  const getActivityIcon = (type) => {
    if (type === "interview") {
      return <CircleCheckBig size={15} />;
    }

    return <Briefcase size={15} />;
  };

  const getActivityColor = (type) => {
    if (type === "interview") {
      return "bg-green-100 text-green-600";
    }

    if (type === "assessment") {
      return "bg-blue-100 text-blue-600";
    }

    return "bg-blue-100 text-blue-600";
  };

  const formatActivityTime = (createdAt) => {
    if (!createdAt) return "";

    const activityDate = new Date(createdAt);
    const now = new Date();

    const differenceInSeconds = Math.floor(
      (now - activityDate) / 1000
    );

    if (differenceInSeconds < 60) {
      return "Just now";
    }

    const differenceInMinutes = Math.floor(
      differenceInSeconds / 60
    );

    if (differenceInMinutes < 60) {
      return `${differenceInMinutes} min${
        differenceInMinutes !== 1 ? "s" : ""
      } ago`;
    }

    const differenceInHours = Math.floor(
      differenceInMinutes / 60
    );

    if (differenceInHours < 24) {
      return `${differenceInHours} hour${
        differenceInHours !== 1 ? "s" : ""
      } ago`;
    }

    const differenceInDays = Math.floor(
      differenceInHours / 24
    );

    if (differenceInDays === 1) {
      return "Yesterday";
    }

    if (differenceInDays < 7) {
      return `${differenceInDays} days ago`;
    }

    return activityDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  /*
   * Deadline activities are intentionally hidden.
   * Assessment activities remain visible.
   */
  const visibleActivities = activities.filter(
    (activity) => activity.type !== "deadline"
  );

  return (
    <div className="h-full w-full rounded-2xl bg-white p-6 shadow-md">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Activity Feed
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Your latest activity
          </p>
        </div>
      </div>

      {/* Activities */}
      <div>
        {visibleActivities.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500">
              No activity yet.
            </p>
          </div>
        ) : (
          visibleActivities
            .slice(0, 4)
            .map((activity, index) => (
              <div
                key={activity.id}
                className={`flex items-center gap-3 py-3 transition-colors duration-200 hover:bg-gray-50 ${
                  index !==
                  Math.min(visibleActivities.length, 4) - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >

                {/* Icon */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getActivityColor(
                    activity.type
                  )}`}
                >
                  {getActivityIcon(activity.type)}
                </div>

                {/* Activity Text */}
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {activity.message}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {formatActivityTime(activity.createdAt)}
                  </p>
                </div>

              </div>
            ))
        )}
      </div>
    </div>
  );
}