import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { LuArrowLeft, LuSave, LuUserRound } from "react-icons/lu";

import { toast } from "react-toastify";

import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";

import Loading from "../components/common/Loading.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import FieldError from "../components/common/FieldError.jsx";

import {
  fetchUserById,
  updateUser,
} from "../features/admin/users/users.service.js";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const roleOptions = [
    { label: "Reporter", value: "REPORTER" },
    { label: "Agent", value: "AGENT" },
  ];

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");

        const userData = await fetchUserById(id);

        setUser(userData);
        setEmail(userData.email || "");
        setRole(userData.role || "");
      } catch (error) {
        console.error("Failed to fetch user:", error);

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

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!role) {
      newErrors.role = "Role is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const userData = {
        email: email.trim(),
        role,
      };

      await updateUser(id, userData);

      toast.success("User updated successfully.");

      navigate("/admin/users");
    } catch (error) {
      console.error("Failed to update user:", error);

      setError(
        error?.message ||
          "Failed to update user. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="p-4 sm:p-6">
        <div className="mx-auto max-w-xl">
          <Loading />
        </div>
      </main>
    );
  }

  if (error && !user) {
    return (
      <main className="p-4 sm:p-6">
        <div className="mx-auto max-w-xl space-y-6">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-primary"
          >
            <LuArrowLeft size={18} strokeWidth={1.9} />
            Back to Users
          </button>

          <ErrorMessage message={error} />
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6">
      <div className="mx-auto max-w-xl space-y-6">

        <section className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LuUserRound size={21} strokeWidth={1.9} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">
              Edit User
            </h1>

            <p className="mt-1 text-sm text-text-muted">
              Update the user’s email and role.
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

        {error && <ErrorMessage message={error} />}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
        >
          <div className="border-b border-border bg-background/50 px-5 py-4">
            <h2 className="text-base font-semibold text-text">
              Account Information
            </h2>
          </div>

          <div className="space-y-5 p-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Email
              </label>

              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter email address"
                disabled={saving}
              />

              {errors.email && (
                <FieldError message={errors.email} />
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Role
              </label>

              <Select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                options={roleOptions}
                disabled={saving}
              />

              {errors.role && (
                <FieldError message={errors.role} />
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/users")}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving}
              >
                <LuSave size={17} strokeWidth={1.9} />
                {saving ? "Updating..." : "Update User"}
              </Button>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
};

export default EditUser;