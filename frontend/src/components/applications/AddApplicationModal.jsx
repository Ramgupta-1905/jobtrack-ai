import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function AddApplicationModal({
  application,
  onClose,
  onAdd,
}) {
  const [form, setForm] = useState(
    application || {
      company: "",
      role: "",
      city: "",
      state: "",

      jobType: "Internship",
      workMode: "Remote",
      status: "Applied",
      appliedDate: "",

      source: "LinkedIn",
      jobLink: "",
      stipend: "",
      experience: "",

      skills: "",
      description: "",
      notes: "",

      // Interview fields
      interviewDate: "",
      interviewTime: "",
      interviewMode: "Virtual",
      interviewType: "Technical",

      // Assessment fields
      assessmentDate: "",
      assessmentType: "",

      // Assessment Deadline
      deadlineDate: "",
    }
  );

  useEffect(() => {
    if (application) {
      setForm({
        ...application,

        skills: Array.isArray(application.skills)
          ? application.skills.join(", ")
          : application.skills || "",

        // Interview fields
        interviewDate: application.interviewDate || "",
        interviewTime: application.interviewTime || "",
        interviewMode: application.interviewMode || "Virtual",
        interviewType: application.interviewType || "Technical",

        // Assessment fields
        assessmentDate: application.assessmentDate || "",
        assessmentType: application.assessmentType || "",

        // Assessment Deadline
        deadlineDate: application.deadlineDate || "",
      });
    } else {
      setForm({
        company: "",
        role: "",
        city: "",
        state: "",

        jobType: "Internship",
        workMode: "Remote",
        status: "Applied",
        appliedDate: "",

        source: "LinkedIn",
        jobLink: "",
        stipend: "",
        experience: "",

        skills: "",
        description: "",
        notes: "",

        // Interview fields
        interviewDate: "",
        interviewTime: "",
        interviewMode: "Virtual",
        interviewType: "Technical",

        // Assessment fields
        assessmentDate: "",
        assessmentType: "",

        // Assessment Deadline
        deadlineDate: "",
      });
    }
  }, [application]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updatedForm = {
        ...prev,
        [name]: value,
      };

      /*
       * Clear assessment details when the
       * application moves away from Assessment.
       */
      if (name === "status" && value !== "Assessment") {
        updatedForm.assessmentType = "";
        updatedForm.assessmentDate = "";
        updatedForm.deadlineDate = "";
      }

      /*
       * Clear interview details when the
       * application moves away from Interview Scheduled.
       */
      if (
        name === "status" &&
        value !== "Interview Scheduled"
      ) {
        updatedForm.interviewDate = "";
        updatedForm.interviewTime = "";
        updatedForm.interviewMode = "Virtual";
        updatedForm.interviewType = "Technical";
      }

      return updatedForm;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.company ||
      !form.role ||
      !form.city ||
      !form.state ||
      !form.appliedDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    /*
     * Interview details are required only
     * when the application is scheduled for an interview.
     */
    if (form.status === "Interview Scheduled") {
      if (
        !form.interviewDate ||
        !form.interviewTime ||
        !form.interviewMode ||
        !form.interviewType
      ) {
        alert(
          "Please fill in the interview date, time, mode, and type."
        );
        return;
      }
    }

    /*
     * Assessment details are required only
     * when the application is in Assessment stage.
     */
    if (form.status === "Assessment") {
      if (
        !form.assessmentType ||
        !form.assessmentDate
      ) {
        alert(
          "Please provide the assessment type and assessment date."
        );
        return;
      }
    }

    onAdd({
      ...form,
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {application
              ? "Edit Application"
              : "Add Application"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Company */}
          <h3 className="border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900">
            Company Information
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Company Name
            </label>

            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Job Role
            </label>

            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* City + State */}
          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium">
                City
              </label>

              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                State
              </label>

              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
                required
              />
            </div>

          </div>

          {/* Application Details */}
          <h3 className="border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900">
            Application Details
          </h3>

          {/* Job Type + Work Mode */}
          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Job Type
              </label>

              <select
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option>Internship</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Work Mode
              </label>

              <select
                name="workMode"
                value={form.workMode}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </select>
            </div>

          </div>

          {/* Applied Date + Status */}
          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Applied Date
              </label>

              <input
                type="date"
                name="appliedDate"
                value={form.appliedDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option>Applied</option>
                <option>Assessment</option>
                <option>Interview Scheduled</option>
                <option>Offer Received</option>
                <option>Rejected</option>
              </select>
            </div>

          </div>

          {/* Assessment Details */}
          {form.status === "Assessment" && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">

              <h3 className="mb-4 border-b border-blue-100 pb-2 text-lg font-semibold text-slate-900">
                Assessment Details
              </h3>

              <div className="grid gap-4 md:grid-cols-2">

                {/* Assessment Type */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Assessment Type
                  </label>

                  <select
                    name="assessmentType"
                    value={form.assessmentType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">
                      Select Assessment
                    </option>

                    <option value="Coding Assessment">
                      Coding Assessment
                    </option>

                    <option value="Aptitude Test">
                      Aptitude Test
                    </option>

                    <option value="Technical Assessment">
                      Technical Assessment
                    </option>

                    <option value="Assignment">
                      Assignment
                    </option>

                    <option value="Online Assessment">
                      Online Assessment
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* Assessment Date */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Assessment Date
                  </label>

                  <input
                    type="date"
                    name="assessmentDate"
                    value={form.assessmentDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:border-blue-500"
                    required
                  />
                </div>

              </div>

              {/* Assessment Deadline */}
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium">
                  Assessment Deadline
                </label>

                <input
                  type="date"
                  name="deadlineDate"
                  value={form.deadlineDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:border-blue-500"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Add the deadline if the assessment has one.
                </p>
              </div>

            </div>
          )}

          {/* Interview Details */}
          {form.status === "Interview Scheduled" && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">

              <h3 className="mb-4 border-b border-blue-100 pb-2 text-lg font-semibold text-slate-900">
                Interview Details
              </h3>

              {/* Date + Time */}
              <div className="grid gap-4 md:grid-cols-2">

                {/* Interview Date */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Interview Date
                  </label>

                  <input
                    type="date"
                    name="interviewDate"
                    value={form.interviewDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:border-blue-500"
                    required
                  />
                </div>

                {/* Interview Time */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Interview Time
                  </label>

                  <input
                    type="time"
                    name="interviewTime"
                    value={form.interviewTime}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:border-blue-500"
                    required
                  />
                </div>

              </div>

              {/* Mode + Type */}
              <div className="mt-4 grid gap-4 md:grid-cols-2">

                {/* Interview Mode */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Interview Mode
                  </label>

                  <select
                    name="interviewMode"
                    value={form.interviewMode}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:border-blue-500"
                    required
                  >
                    <option value="Virtual">
                      Virtual
                    </option>

                    <option value="On-site">
                      On-site
                    </option>

                    <option value="Phone">
                      Phone
                    </option>
                  </select>
                </div>

                {/* Interview Type */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Interview Type
                  </label>

                  <select
                    name="interviewType"
                    value={form.interviewType}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:border-blue-500"
                    required
                  >
                    <option value="HR">
                      HR
                    </option>

                    <option value="Technical">
                      Technical
                    </option>
                  </select>
                </div>

              </div>

            </div>
          )}

          {/* Source */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Application Source
            </label>

            <select
              name="source"
              value={form.source}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            >
              <option>LinkedIn</option>
              <option>Internshala</option>
              <option>Naukri</option>
              <option>Wellfound</option>
              <option>Company Website</option>
              <option>Referral</option>
              <option>Other</option>
            </select>
          </div>

          {/* Job Information */}
          <h3 className="border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900">
            Job Information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Job Link
              </label>

              <input
                type="url"
                name="jobLink"
                value={form.jobLink}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Salary / Stipend
              </label>

              <input
                type="text"
                name="stipend"
                value={form.stipend}
                onChange={handleChange}
                placeholder="₹50,000/month"
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium">
              Experience Required
            </label>

            <input
              type="text"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="0-1 Years"
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Additional Information */}
          <h3 className="border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900">
            Additional Information
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Skills Required
            </label>

            <textarea
              rows={3}
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, JavaScript, Tailwind CSS..."
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Job Description
            </label>

            <textarea
              rows={5}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Paste the job description here..."
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Personal Notes
            </label>

            <textarea
              rows={4}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add your notes..."
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              {application
                ? "Save Changes"
                : "Add Application"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}