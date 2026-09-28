import { useEffect, useState } from "react";

const API_URL = "https://jobtrack-ai-4dnt.onrender.com";

const ALL_SKILLS = [
  "Java",
  "React",
  "Spring Boot",
  "SQL",
  "Git",
  "DSA",
  "Python",
  "C++",
  "JavaScript",
  "Node.js",
];

const INITIAL_PROFILE = {
  id: null,
  name: "",
  email: "",
  username: "",
  phone: "",
  city: "",
  state: "",
  college: "",
  degree: "",
  branch: "",
  graduationYear: "",
  cgpa: "",
  bio: "",
  githubUrl: "",
  linkedinUrl: "",
  leetcodeUrl: "",
  geeksforgeeksUrl: "",
  portfolioUrl: "",
  skills: [],
};

function Profile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in. Please login first.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile");
      }

      setProfile({
        id: data.id ?? null,
        name: data.name ?? "",
        email: data.email ?? "",
        username: data.username ?? "",
        phone: data.phone ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        college: data.college ?? "",
        degree: data.degree ?? "",
        branch: data.branch ?? "",
        graduationYear: data.graduationYear ?? "",
        cgpa: data.cgpa ?? "",
        bio: data.bio ?? "",
        githubUrl: data.githubUrl ?? "",
        linkedinUrl: data.linkedinUrl ?? "",
        leetcodeUrl: data.leetcodeUrl ?? "",
        geeksforgeeksUrl: data.geeksforgeeksUrl ?? "",
        portfolioUrl: data.portfolioUrl ?? "",
        skills: Array.isArray(data.skills) ? data.skills : [],
      });
    } catch (err) {
      setError(err.message || "Something went wrong while loading profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));
  };

  const addSkill = (skill) => {
    setProfile((previousProfile) => ({
      ...previousProfile,
      skills: [...previousProfile.skills, skill],
    }));

    setSearch("");
  };

  const removeSkill = (skillToRemove) => {
    setProfile((previousProfile) => ({
      ...previousProfile,
      skills: previousProfile.skills.filter(
        (skill) => skill !== skillToRemove,
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in. Please login first.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: profile.name,
        username: profile.username,
        phone: profile.phone,
        city: profile.city,
        state: profile.state,
        college: profile.college,
        degree: profile.degree,
        branch: profile.branch,

        graduationYear:
          profile.graduationYear === ""
            ? null
            : Number(profile.graduationYear),

        cgpa: profile.cgpa === "" ? null : Number(profile.cgpa),

        bio: profile.bio,

        githubUrl: profile.githubUrl,
        linkedinUrl: profile.linkedinUrl,
        leetcodeUrl: profile.leetcodeUrl,
        geeksforgeeksUrl: profile.geeksforgeeksUrl,
        portfolioUrl: profile.portfolioUrl,

        skills: profile.skills,
      };

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile");
      }

      setProfile({
        id: data.id ?? null,
        name: data.name ?? "",
        email: data.email ?? "",
        username: data.username ?? "",
        phone: data.phone ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        college: data.college ?? "",
        degree: data.degree ?? "",
        branch: data.branch ?? "",
        graduationYear: data.graduationYear ?? "",
        cgpa: data.cgpa ?? "",
        bio: data.bio ?? "",
        githubUrl: data.githubUrl ?? "",
        linkedinUrl: data.linkedinUrl ?? "",
        leetcodeUrl: data.leetcodeUrl ?? "",
        geeksforgeeksUrl: data.geeksforgeeksUrl ?? "",
        portfolioUrl: data.portfolioUrl ?? "",
        skills: Array.isArray(data.skills) ? data.skills : [],
      });

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Something went wrong while saving profile");
    } finally {
      setSaving(false);
    }
  };

  const filteredSkills = ALL_SKILLS.filter(
    (skill) =>
      skill.toLowerCase().includes(search.toLowerCase()) &&
      !profile.skills.includes(skill),
  );

  const profileInitial = profile.name
    ? profile.name.charAt(0).toUpperCase()
    : "R";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-blue-50 p-8">
        <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-md">
          <p className="text-lg font-semibold text-gray-800">
            Loading your profile...
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we fetch your information.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-8 py-6 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="mt-2 text-5xl font-bold text-white">
                👤 My Profile
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-blue-100">
                Manage your personal, academic, and professional information
                to keep your JobTrack AI profile up to date.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                <div className="h-28 bg-gradient-to-r from-blue-600 to-blue-500"></div>

                <div className="-mt-14 flex flex-col items-center px-6 pb-6">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-blue-100">
                    <span className="text-4xl font-bold text-blue-600">
                      {profileInitial}
                    </span>
                  </div>

                  <h2 className="mt-4 text-center text-2xl font-bold text-gray-800">
                    {profile.name || "Your Name"}
                  </h2>

                  <p className="text-gray-500">
                    @{profile.username || "username"}
                  </p>

                  <p className="mt-1 text-center text-sm text-gray-400">
                    Profile ID •{" "}
                    {profile.id ? `JT-${profile.id}` : "Not available"}
                  </p>

                  <button
                    type="button"
                    disabled
                    className="mt-6 cursor-not-allowed rounded-lg bg-gray-300 px-5 py-2 font-medium text-gray-600"
                  >
                    Change Photo
                  </button>
                </div>
              </div>

              {/* Skills */}
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  Skills
                </h3>

                <div className="mb-4 flex flex-wrap gap-3">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
                    >
                      {skill}

                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove ${skill}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))}

                  {profile.skills.length === 0 && (
                    <p className="text-sm text-gray-400">
                      No skills added yet.
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label
                    htmlFor="skillSearch"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Search Skill
                  </label>

                  <input
                    id="skillSearch"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search and add your skills..."
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                  />

                  {search && filteredSkills.length > 0 && (
                    <ul className="absolute z-10 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow-md">
                      {filteredSkills.map((skill) => (
                        <li key={skill}>
                          <button
                            type="button"
                            onClick={() => addSkill(skill)}
                            className="block w-full px-4 py-2 text-left hover:bg-blue-100"
                          >
                            {skill}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Personal Information */}
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <h3 className="mb-6 text-2xl font-semibold text-gray-800">
                  Personal Information
                </h3>

                <div className="grid gap-5 md:grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={profile.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label
                      htmlFor="username"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>

                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={profile.username}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 p-3 text-gray-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={profile.city}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label
                      htmlFor="state"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      State
                    </label>

                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={profile.state}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <h3 className="mb-6 text-2xl font-semibold text-gray-800">
                  Academic Information
                </h3>

                <div className="grid gap-5 md:grid-cols-2">
                  {/* College */}
                  <div>
                    <label
                      htmlFor="college"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      College
                    </label>

                    <input
                      id="college"
                      name="college"
                      type="text"
                      value={profile.college}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Degree */}
                  <div>
                    <label
                      htmlFor="degree"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Degree
                    </label>

                    <input
                      id="degree"
                      name="degree"
                      type="text"
                      value={profile.degree}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Branch */}
                  <div>
                    <label
                      htmlFor="branch"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Branch
                    </label>

                    <input
                      id="branch"
                      name="branch"
                      type="text"
                      value={profile.branch}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Graduation Year */}
                  <div>
                    <label
                      htmlFor="graduationYear"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Graduation Year
                    </label>

                    <input
                      id="graduationYear"
                      name="graduationYear"
                      type="number"
                      value={profile.graduationYear}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* CGPA */}
                  <div>
                    <label
                      htmlFor="cgpa"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      CGPA
                    </label>

                    <input
                      id="cgpa"
                      name="cgpa"
                      type="number"
                      step="0.01"
                      value={profile.cgpa}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* About Me */}
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <h3 className="mb-6 text-2xl font-semibold text-gray-800">
                  About Me
                </h3>

                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  rows={5}
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell recruiters about yourself, your skills, projects, achievements, and career goals..."
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                ></textarea>
              </div>

              {/* Social Links */}
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <h3 className="mb-6 text-2xl font-semibold text-gray-800">
                  Social & Portfolio
                </h3>

                <div className="grid gap-5">
                  {/* GitHub */}
                  <div>
                    <label
                      htmlFor="githubUrl"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      GitHub
                    </label>

                    <input
                      id="githubUrl"
                      name="githubUrl"
                      type="url"
                      value={profile.githubUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/username"
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label
                      htmlFor="linkedinUrl"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      LinkedIn
                    </label>

                    <input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      type="url"
                      value={profile.linkedinUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* LeetCode */}
                  <div>
                    <label
                      htmlFor="leetcodeUrl"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      LeetCode
                    </label>

                    <input
                      id="leetcodeUrl"
                      name="leetcodeUrl"
                      type="url"
                      value={profile.leetcodeUrl}
                      onChange={handleChange}
                      placeholder="https://leetcode.com/u/username"
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* GeeksforGeeks */}
                  <div>
                    <label
                      htmlFor="geeksforgeeksUrl"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      GeeksforGeeks
                    </label>

                    <input
                      id="geeksforgeeksUrl"
                      name="geeksforgeeksUrl"
                      type="url"
                      value={profile.geeksforgeeksUrl}
                      onChange={handleChange}
                      placeholder="https://geeksforgeeks.org/profile/username"
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Portfolio */}
                  <div>
                    <label
                      htmlFor="portfolioUrl"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Portfolio Website
                    </label>

                    <input
                      id="portfolioUrl"
                      name="portfolioUrl"
                      type="url"
                      value={profile.portfolioUrl}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Profile;