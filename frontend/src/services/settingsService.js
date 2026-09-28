const API_URL = "https://jobtrack-ai-4dnt.onrender.com";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Get saved settings
export const getSettings = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch settings.");
  }

  return response.json();
};

// Save notification + AI preferences
export const updateSettings = async (settings) => {
  const response = await fetch(API_URL, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Failed to update settings.");
  }

  return response.json();
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  const response = await fetch(`${API_URL}/change-password`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Failed to change password.");
  }

  return response.text();
};