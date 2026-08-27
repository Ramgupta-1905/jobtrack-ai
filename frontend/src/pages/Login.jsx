import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 p-4">

      {/* Background Glow */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-400/20 blur-[120px]" />

      {/* Login Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">

        {/* Back */}
        <Link
          to="/"
          className="mb-6 inline-block text-slate-400 transition-all duration-300 hover:text-cyan-300"
        >
          ← Back to Home
        </Link>

        {/* Branding */}
        <div className="mb-8 flex flex-col items-center">

          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 text-4xl font-bold shadow-2xl shadow-blue-500/40">
            J
          </div>

          <h1 className="mb-2 text-4xl font-bold tracking-tight text-white">
            Welcome Back!
          </h1>

          <p className="text-center text-sm leading-6 text-slate-300">
            Continue your journey toward your next opportunity.
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>

            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-600 bg-slate-800/70 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all duration-300 hover:border-slate-500 focus:border-cyan-400 focus:bg-slate-800 focus:ring-4 focus:ring-cyan-400/10"
            />

          </div>

          {/* Password */}
          <div>

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Password
            </label>

            <div className="relative">

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-600 bg-slate-800/70 px-4 py-3 pr-12 text-white placeholder:text-slate-500 outline-none transition-all duration-300 hover:border-slate-500 focus:border-cyan-400 focus:bg-slate-800 focus:ring-4 focus:ring-cyan-400/10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>

            </div>

          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <input
                id="remember"
                type="checkbox"
                className="accent-cyan-400"
              />

              <label
                htmlFor="remember"
                className="text-sm text-slate-400"
              >
                Remember Me
              </label>

            </div>

            <a
              href="#"
              className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              Forgot Password?
            </a>

          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/30"
          >
            Sign In
          </button>

        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-400">

          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Create Account
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}