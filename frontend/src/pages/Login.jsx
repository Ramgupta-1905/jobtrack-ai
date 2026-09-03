import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
        })
      );

      navigate("/dashboard");

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 p-4">

      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-400/20 blur-[120px]" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">

        <Link
          to="/"
          className="mb-6 inline-block text-slate-400 transition-all duration-300 hover:text-cyan-300"
        >
          ← Back to Home
        </Link>

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

        <form onSubmit={handleSubmit} className="space-y-5">

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-600 bg-slate-800/70 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition-all duration-300 hover:border-slate-500 focus:border-cyan-400 focus:bg-slate-800 focus:ring-4 focus:ring-cyan-400/10"
            />
          </div>

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          {error && (
            <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

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