import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    if (!email.trim()) {
      alert("Email is required");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      // Read response safely
      const responseText = await response.text();
      console.log("STATUS:", response.status);
      console.log("RESPONSE:", responseText);

      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = {};
        }
      }

      console.log("Signup response:", data);
      console.log("Signup status:", response.status);

      // Backend returned an error
     if (!response.ok) {
  if (response.status === 409) {
    alert("Email already registered");
  } else if (response.status === 400) {
    alert(data.message || "Please check your signup details.");
  } else {
    alert(data.message || "Signup failed. Please try again.");
  }

  return;
}
      // Successful signup
      console.log("Signup successful:", data);

      navigate("/dashboard");

    } catch (error) {
      console.error("Signup error:", error);
      alert("Unable to connect to the backend");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">

      {/* Background Glow */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-400/20 blur-[120px]" />

      {/* Signup Card */}
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

          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 text-3xl font-bold shadow-2xl shadow-blue-500/40">
            J
          </div>

          <h1 className="mb-2 text-4xl font-bold tracking-tight text-white">
            Join JobTrack AI
          </h1>

          <p className="text-center text-sm leading-6 text-slate-300">
            Create your account and take the first step toward your next
            opportunity.
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-600 bg-slate-800/70 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all duration-300 hover:border-slate-500 focus:border-cyan-400 focus:bg-slate-800 focus:ring-4 focus:ring-cyan-400/10"
            />
          </div>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
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

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/30"
          >
            Create Account
          </button>

        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}