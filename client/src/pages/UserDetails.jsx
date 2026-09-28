import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuMail,
  LuShieldCheck,
  LuUserRound,
} from "react-icons/lu";

import { fetchUserById } from "../features/admin/users/users.service.js";

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");
        setUser(null);

        const userData = await fetchUserById(id);

        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setError(
          error?.message ||
            "Failed to fetch user details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  return (
    <main className="p-4 sm:p-6">
      <div className="mx-auto max-w-xl space-y-6">
        <section className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LuUserRound size={21} strokeWidth={1.9} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">
              User Details
            </h1>

            <p className="mt-1 text-sm text-text-muted">
              View information about this user account.
            </p>
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <LuArrowLeft size={18} strokeWidth={1.9} />
          Back to Users
        </button>

        {loading && (
          <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-text-muted">
            Loading user details...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">
            {error}
          </div>
        )}

        {!loading && !error && !user && (
          <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-text-muted">
            User details not found.
          </div>
        )}

        {!loading && !error && user && (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border bg-background/50 px-5 py-4">
              <h2 className="text-base font-semibold text-text">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Basic details and access information.
              </p>
            </div>

            <div className="divide-y divide-border">
              <div className="flex items-start gap-4 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <LuUserRound size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                    User ID
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-text">
                    {user.id ?? "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <LuUserRound size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                    Name
                  </p>

                  <p className="mt-1 text-sm font-medium text-text">
                    {user.name || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <LuMail size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-text">
                    {user.email || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                  <LuShieldCheck size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                    Role
                  </p>

                  <span className="mt-1 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {user.role || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default UserDetails;