import { useEffect, useState } from "react";

import ApplicationsHeader from "../components/applications/ApplicationsHeader";
import ApplicationsStats from "../components/applications/ApplicationsStats";
import SearchFilters from "../components/applications/SearchFilters";
import ApplicationsGrid from "../components/applications/ApplicationsGrid";
import EmptyState from "../components/applications/EmptyState";
import AddApplicationModal from "../components/applications/AddApplicationModal";

import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../services/applicationService";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    status: "All Status",
    jobType: "All Job Types",
    workMode: "All Work Modes",
    sortBy: "Newest",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  // Fetch applications when page loads
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const data = await getApplications();

      setApplications(data);
    } catch (error) {
      console.error("Failed to load applications:", error);
      alert("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications
    .filter((application) => {
      const search = filters.search.toLowerCase();

      const matchesSearch =
        application.company.toLowerCase().startsWith(search) ||
        application.role.toLowerCase().startsWith(search) ||
        application.city.toLowerCase().startsWith(search) ||
        application.state.toLowerCase().startsWith(search);

      const matchesStatus =
        filters.status === "All Status" ||
        application.status === filters.status;

      const matchesJobType =
        filters.jobType === "All Job Types" ||
        application.jobType === filters.jobType;

      const matchesWorkMode =
        filters.workMode === "All Work Modes" ||
        application.workMode === filters.workMode;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesJobType &&
        matchesWorkMode
      );
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "Oldest":
          return (
            new Date(a.appliedDate) -
            new Date(b.appliedDate)
          );

        case "Company Name (A-Z)":
          return a.company.localeCompare(b.company);

        case "Status":
          return a.status.localeCompare(b.status);

        case "Newest":
        default:
          return (
            new Date(b.appliedDate) -
            new Date(a.appliedDate)
          );
      }
    });

  const stats = {
    total: applications.length,

    applied: applications.filter(
      (application) =>
        application.status === "Applied"
    ).length,

    interviews: applications.filter(
      (application) =>
        application.status === "Interview Scheduled"
    ).length,

    offers: applications.filter(
      (application) =>
        application.status === "Offer Received"
    ).length,
  };

  // DELETE APPLICATION
  const handleDeleteApplication = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
      await deleteApplication(id);

      setApplications((prev) =>
        prev.filter(
          (application) => application.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete application:",
        error
      );

      alert("Failed to delete application.");
    }
  };

  // EDIT APPLICATION
  const handleEditApplication = (application) => {
    setEditingApplication(application);
    setIsModalOpen(true);
  };

  // ADD / UPDATE APPLICATION
  const handleSaveApplication = async (applicationData) => {
    try {
      if (editingApplication) {
        // UPDATE
        const updatedApplication =
          await updateApplication(
            editingApplication.id,
            applicationData
          );

        setApplications((prev) =>
          prev.map((application) =>
            application.id === editingApplication.id
              ? updatedApplication
              : application
          )
        );
      } else {
        // CREATE
        const newApplication =
          await createApplication(
            applicationData
          );

        setApplications((prev) => [
          ...prev,
          newApplication,
        ]);
      }

      setEditingApplication(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error(
        "Failed to save application:",
        error
      );

      alert(
        error?.message ||
          "Failed to save application."
      );
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-6 text-white shadow-lg">
        <ApplicationsHeader
          onAddApplication={() => {
            setEditingApplication(null);
            setIsModalOpen(true);
          }}
        />

        <ApplicationsStats stats={stats} />
      </section>

      {/* Search & Filters */}
      <SearchFilters
        filters={filters}
        setFilters={setFilters}
      />

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-16 text-gray-500">
          Loading applications...
        </div>
      ) : filteredApplications.length > 0 ? (
        <ApplicationsGrid
          applications={filteredApplications}
          onDelete={handleDeleteApplication}
          onEdit={handleEditApplication}
        />
      ) : (
        <EmptyState />
      )}

      {/* Add / Edit Application Modal */}
      {isModalOpen && (
        <AddApplicationModal
          application={editingApplication}
          onClose={() => {
            setIsModalOpen(false);
            setEditingApplication(null);
          }}
          onAdd={handleSaveApplication}
        />
      )}
    </div>
  );
}