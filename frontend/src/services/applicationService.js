const API_URL = "https://jobtrack-ai-4dnt.onrender.com/api/applications";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getApplications = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch applications.");
  }

  return response.json();
};

export const getApplication = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch application.");
  }

  return response.json();
};

export const createApplication = async (applicationData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(applicationData),
  });

  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(
      errorMessage || "Failed to create application."
    );
  }

  return response.json();
};

export const updateApplication = async (
  id,
  applicationData
) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(applicationData),
  });

  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(
      errorMessage || "Failed to update application."
    );
  }

  return response.json();
};

export const deleteApplication = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete application.");
  }
};