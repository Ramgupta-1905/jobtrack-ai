import { useState } from "react";
import { ArrowLeft, Bug, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ReportBug() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    email: "",
    severity: "Low",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Bug report submitted successfully!");

    setFormData({
      title: "",
      email: "",
      severity: "Low",
      description: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-8 py-7 shadow-lg">
          <button
            onClick={() => navigate("/settings")}
            className="mb-6 flex items-center gap-2 text-sm text-blue-100 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Settings
          </button>

          <div className="flex items-center gap-3">
            <Bug size={28} className="text-white" />

            <h1 className="text-4xl font-bold text-white">
              Report a Bug
            </h1>
          </div>

          <p className="mt-3 max-w-2xl text-blue-100">
            Found something that isn't working correctly? Let us know about it.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {/* Bug Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Bug Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Briefly describe the problem"
              required
              className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Email */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Severity */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Severity
            </label>

            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Description */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what happened and how the bug can be reproduced..."
              rows={7}
              required
              className="w-full resize-none rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Send size={17} />
            Submit Bug Report
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportBug;