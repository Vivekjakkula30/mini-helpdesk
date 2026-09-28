import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff, LuUserPlus } from "react-icons/lu";
import { toast } from "react-toastify";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import FieldError from "../components/common/FieldError.jsx";
import { addUser } from "../features/admin/users/users.service.js";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("AGENT");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const roleOptions = [
    { value: "AGENT", label: "Agent" },
    { value: "REPORTER", label: "Reporter" },
  ];

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setRole("AGENT");
    setErrors({});
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  const newErrors = {};

  if (!name.trim()) {
    newErrors.name = "Name is required.";
  }

  if (!email.trim()) {
    newErrors.email = "Email is required.";
  }

  if (!password.trim()) {
    newErrors.password = "Password is required.";
  }

  if (!role) {
    newErrors.role = "Role is required.";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    return;
  }

  try {
    setLoading(true);
    setError("");

    const userData = {
      name: name.trim(),
      email: email.trim(),
      password,
      role,
    };

    await addUser(userData);

    resetForm();

    toast.success("User created successfully.");

    navigate("/admin/users", {
      replace: true,
    });
  } catch (error) {
    console.error("Failed to create user:", error);

    setError(
      error?.message || "Failed to create user. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="p-4 sm:p-6">
      <div className="mx-auto max-w-xl space-y-6">
        <section className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LuUserPlus size={21} strokeWidth={1.9} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">
              Add User
            </h1>

            <p className="mt-1 text-sm text-text-muted">
              Create a new user account.
            </p>
          </div>
        </section>

        {error && <ErrorMessage message={error} />}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-border bg-surface p-5 shadow-sm"
        >
          <div className="border-b border-border pb-4">
            <h2 className="text-base font-semibold text-text">
              User Information
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Enter the details and access role for the new user.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Name
              </label>

              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter name"
              />

              <FieldError message={errors.name} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Email
              </label>

              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter email"
                type="email"
              />

              <FieldError message={errors.email} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Password
              </label>

              <div className="relative">
                <Input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  type={showPassword ? "text" : "password"}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-text-muted cursor-pointer transition-colors hover:bg-background hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {showPassword ? (
                    <LuEyeOff size={18} strokeWidth={1.8} />
                  ) : (
                    <LuEye size={18} strokeWidth={1.8} />
                  )}
                </button>
              </div>

              <FieldError message={errors.password} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Role
              </label>

              <Select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                options={roleOptions}
              />

              <FieldError message={errors.role} />
            </div>
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Adding..." : "Add User"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddUser;