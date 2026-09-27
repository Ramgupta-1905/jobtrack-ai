import { useState } from "react";
import { ArrowLeft, MessageSquare, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SendFeedback() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    type: "Suggestion",
    message: "",
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

    alert("Thank you for your feedback!");

    setFormData({
      email: "",
      type: "Suggestion",
      message: "",
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
            <MessageSquare size={28} className="text-white" />

            <h1 className="text-4xl font-bold text-white">
              Send Feedback
            </h1>
          </div>

          <p className="mt-3 max-w-2xl text-blue-100">
            Share your ideas, suggestions, or thoughts to help improve
            JobTrack AI.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {/* Email */}
          <div>
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

          {/* Feedback Type */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Feedback Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="Suggestion">Suggestion</option>
              <option value="Feature Request">Feature Request</option>
              <option value="User Experience">User Experience</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Message */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Your Feedback
            </label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us what you think..."
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
            Send Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

export default SendFeedback;