import {
  ArrowLeft,
  Briefcase,
  Target,
  Sparkles,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AboutJobTrack() {
  const navigate = useNavigate();

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
            <Briefcase size={28} className="text-white" />

            <h1 className="text-4xl font-bold text-white">
              About JobTrack AI
            </h1>
          </div>

          <p className="mt-3 max-w-2xl text-blue-100">
            A centralized workspace designed to help students and job seekers
            organize their job search journey.
          </p>
        </div>

        {/* About */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-blue-600">
            What is JobTrack AI?
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            JobTrack AI helps you keep your job applications, interviews,
            resumes, profile information, and other important career details
            organized in one place.
          </p>

          <p className="mt-3 leading-7 text-gray-600">
            Instead of managing applications across spreadsheets, notes, and
            different platforms, JobTrack AI provides a single workspace to
            keep your job search organized.
          </p>
        </div>

        {/* Features */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <Target className="text-blue-600" size={26} />

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Stay Organized
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Keep track of your applications and important job search
              information from one place.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <Sparkles className="text-blue-600" size={26} />

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Manage Your Career
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Organize resumes, interviews, applications, and profile details
              throughout your job search.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <Users className="text-blue-600" size={26} />

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Built for Job Seekers
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Designed with students and early-career professionals in mind.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <Briefcase className="text-blue-600" size={26} />

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              One Workspace
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Access the tools you need for managing your job search through a
              single platform.
            </p>
          </div>
        </div>

        {/* Version */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            JobTrack AI • Frontend v1
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutJobTrack;