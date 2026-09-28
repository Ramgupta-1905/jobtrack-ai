const API_URL = "https://jobtrack-ai-4dnt.onrender.com";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// =========================================================
// GET ALL INTERVIEWS
// =========================================================

export const getInterviews = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch interviews.");
  }

  return response.json();
};


// =========================================================
// GET SINGLE INTERVIEW
// =========================================================

export const getInterview = async (applicationId) => {
  const response = await fetch(
    `${API_URL}/${applicationId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch interview.");
  }

  return response.json();
};


// =========================================================
// CREATE INTERVIEW
// =========================================================

export const createInterview = async (
  applicationId,
  interviewData
) => {
  const response = await fetch(
    `${API_URL}/application/${applicationId}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(interviewData),
    }
  );

  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(
      errorMessage || "Failed to create interview."
    );
  }

  return response.json();
};


// =========================================================
// UPDATE INTERVIEW
// =========================================================

export const updateInterview = async (
  applicationId,
  interviewData
) => {
  const response = await fetch(
    `${API_URL}/${applicationId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(interviewData),
    }
  );

  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(
      errorMessage || "Failed to update interview."
    );
  }

  return response.json();
};