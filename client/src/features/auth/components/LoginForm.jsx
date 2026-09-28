import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff, LuLogIn } from "react-icons/lu";

import { loginUser } from "../auth.service.js";
import AuthContext from "../../../context/AuthContext.jsx";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginUser(email, password);

      login(response.token, response.user);

      const dashboardPaths = {
        ADMIN: "/admin/dashboard",
        AGENT: "/agent/dashboard",
        REPORTER: "/reporter/dashboard",
      };

      navigate(dashboardPaths[response.user.role]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LuLogIn size={24} strokeWidth={1.8} />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-text">
          Welcome back
        </h2>

        <p className="mt-2 text-sm text-text-muted">
          Sign in to your account to continue.
        </p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-text"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Password */}
      <div className="mt-5 space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-text"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 pr-11 text-sm text-text placeholder:text-text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-text-muted transition-colors hover:text-text"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <LuEyeOff size={19} strokeWidth={1.8} />
            ) : (
              <LuEye size={19} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {/* Forgot Password */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          className="cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Forgot password?
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Login Button */}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;