import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WelcomeCard from "../components/dashboard/WelcomeCard";
import AddApplications from "../components/dashboard/AddApplications";
import MiniCalendar from "../components/dashboard/MiniCalendar";
import NeedsAttention from "../components/dashboard/NeedsAttention";
import RecentApplication from "../components/dashboard/RecentApplication";
import UpcomingInterviews from "../components/dashboard/UpcomingInterview";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import AIAssistant from "../components/dashboard/AIAssistant";

import { getApplications } from "../services/applicationService";
import { getActivities } from "../services/activityService";

function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    user: {
      id: null,
      name: "User",
    },
    recentApplications: [],
    upcomingInterviews: [],
    needsAttention: [],
    activities: [],
    calendarEvents: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      /*
       * Fetch applications and activities from backend
       */
      const [applications, activities] = await Promise.all([
        getApplications(),
        getActivities(),
      ]);

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      /*
       * Recent Applications
       */
      const sortedApplications = [...applications].sort(
        (a, b) =>
          new Date(b.appliedDate) - new Date(a.appliedDate)
      );

      const recentApplications = sortedApplications.slice(0, 4);

      /*
       * Upcoming Interviews
       *
       * Maximum 2 interviews are shown on Dashboard.
       */
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcomingInterviews = applications
        .filter((application) => {
          if (!application.interviewDate) {
            return false;
          }

          const interviewDate = new Date(
            `${application.interviewDate}T00:00:00`
          );

          return interviewDate >= today;
        })
        .sort(
          (a, b) =>
            new Date(
              `${a.interviewDate}T${a.interviewTime || "00:00"}`
            ) -
            new Date(
              `${b.interviewDate}T${b.interviewTime || "00:00"}`
            )
        )
        .slice(0, 2);

      /*
       * Needs Attention
       *
       * Only current application events are shown:
       * - Interview
       * - Assessment
       * - Assessment Deadline
       *
       * If an assessment has a deadline,
       * only the deadline is shown.
       */
      const attentionItems = [];

      applications.forEach((application) => {
        /*
         * Interview
         */
        if (
          application.status === "Interview Scheduled" &&
          application.interviewDate
        ) {
          attentionItems.push({
            ...application,
            type: "interview",
            attentionDate: application.interviewDate,
          });
        }

        /*
         * Assessment Deadline
         *
         * If a deadline exists, show the deadline
         * instead of the assessment date.
         */
        if (
          application.assessmentDate &&
          application.deadlineDate &&
          application.status !== "Interview Scheduled" &&
          application.status !== "Offer Received" &&
          application.status !== "Rejected"
        ) {
          attentionItems.push({
            ...application,
            type: "deadline",
            attentionDate: application.deadlineDate,
          });
        }

        /*
         * Assessment
         *
         * Show the assessment only when there is
         * no assessment deadline.
         */
        if (
          application.assessmentDate &&
          !application.deadlineDate &&
          application.status !== "Interview Scheduled" &&
          application.status !== "Offer Received" &&
          application.status !== "Rejected"
        ) {
          attentionItems.push({
            ...application,
            type: "assessment",
            attentionDate: application.assessmentDate,
          });
        }
      });

      /*
       * Sort Needs Attention by nearest relevant date
       *
       * Maximum 4 items are shown on Dashboard.
       */
      const needsAttention = attentionItems
        .sort(
          (a, b) =>
            new Date(`${a.attentionDate}T00:00:00`) -
            new Date(`${b.attentionDate}T00:00:00`)
        )
        .slice(0, 4);

      /*
       * Calendar Events
       */
      const calendarEvents = [];

      applications.forEach((application) => {
        /*
         * Interview
         */
        if (application.interviewDate) {
          calendarEvents.push({
            date: application.interviewDate,
            type: "interview",
          });
        }

        /*
         * Assessment
         */
        if (
          application.assessmentDate &&
          application.status !== "Interview Scheduled" &&
          application.status !== "Offer Received" &&
          application.status !== "Rejected"
        ) {
          calendarEvents.push({
            date: application.assessmentDate,
            type: "assessment",
          });
        }

        /*
         * Assessment Deadline
         */
        if (
          application.deadlineDate &&
          application.status !== "Interview Scheduled" &&
          application.status !== "Offer Received" &&
          application.status !== "Rejected"
        ) {
          calendarEvents.push({
            date: application.deadlineDate,
            type: "deadline",
          });
        }
      });

      /*
       * Backend Activities
       *
       * Maximum 3 activities are shown on Dashboard.
       */
      const recentActivities = activities.slice(0, 3);

      /*
       * Set Dashboard Data
       */
      setDashboardData({
        user: {
          id: storedUser.id || null,
          name: storedUser.name || "User",
        },
        recentApplications,
        upcomingInterviews,
        needsAttention,
        activities: recentActivities,
        calendarEvents,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddApplication = () => {
    navigate("/applications");
  };

  const handleViewApplications = () => {
    navigate("/applications");
  };

  const handleViewInterviews = () => {
    navigate("/interviews");
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-lg font-medium text-gray-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <p className="font-medium text-red-500">
            Failed to load dashboard.
          </p>

          <button
            onClick={loadDashboard}
            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 lg:p-8">
      <div className="space-y-6">

        {/* Hero Section */}
        <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-8 shadow-xl">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.8fr_1fr]">

            <div className="flex flex-col gap-6">
              <WelcomeCard user={dashboardData.user} />

              <AddApplications
                onClick={handleAddApplication}
              />
            </div>

            <MiniCalendar
              events={dashboardData.calendarEvents}
            />

          </div>
        </section>

        {/* Dashboard Highlights */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <NeedsAttention
            tasks={dashboardData.needsAttention}
          />

          <UpcomingInterviews
            interviews={dashboardData.upcomingInterviews}
            onViewAll={handleViewInterviews}
            onInterviewClick={handleViewInterviews}
          />

          <ActivityFeed
            activities={dashboardData.activities}
          />

        </section>

        {/* Recent Applications */}
        <RecentApplication
          applications={dashboardData.recentApplications}
          onViewAll={handleViewApplications}
          onApplicationClick={handleViewApplications}
        />

        {/* AI Assistant */}
        <section>
          <AIAssistant />
        </section>

      </div>
    </div>
  );
}

export default Dashboard;