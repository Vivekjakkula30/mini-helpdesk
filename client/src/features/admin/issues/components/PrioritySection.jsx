import { useState } from "react";
import { LuFlag } from "react-icons/lu";
import { toast } from "react-toastify";

import { updateIssuePriority } from "../issues.service.js";

import {
  updateAgentIssuePriority,
} from "../../../agent/dashboard/agentDashboard.service.js";

const PrioritySection = ({
  issue,
  user,
  onPrioritySuccess,
}) => {
  const isAdmin =
    user?.role?.toUpperCase() === "ADMIN";

  const isAgent =
    user?.role?.toUpperCase() === "AGENT";

  const isAssignedAgent =
    isAgent &&
    Number(issue?.assignedId) ===
      Number(user?.id);

  const canManagePriority =
    isAdmin || isAssignedAgent;

  const [selectedPriority, setSelectedPriority] =
    useState(issue?.priority || "");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const priorityOptions = [
    {
      value: "HIGH",
      label: "High",
    },
    {
      value: "MEDIUM",
      label: "Medium",
    },
    {
      value: "LOW",
      label: "Low",
    },
  ];

  const handlePriorityUpdate = async () => {
    if (!canManagePriority) {
      setError(
        "Only Admin or the assigned Agent can change the priority."
      );
      return;
    }

    if (!selectedPriority) {
      setError("Please select a priority.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let updatedIssue;

      if (isAdmin) {
        updatedIssue = await updateIssuePriority(
          issue.id,
          selectedPriority
        );
      } else {
        updatedIssue =
          await updateAgentIssuePriority(
            issue.id,
            selectedPriority
          );
      }

      onPrioritySuccess(updatedIssue);

      toast.success(
        "Priority updated successfully"
      );
    } catch (error) {
      setError(
        error.message ||
          "Failed to update priority."
      );

      toast.error(
        error.message ||
          "Failed to update priority."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reporter and unassigned Agent
  // should not see Priority Management.
  if (!canManagePriority) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LuFlag
            size={20}
            strokeWidth={1.9}
          />
        </div>

        <div>
          <h2 className="text-base font-semibold text-text">
            Priority Management
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Manage the priority assigned to this issue.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="w-full sm:w-64">
          <label
            htmlFor="priority"
            className="mb-2 block text-sm font-medium text-text"
          >
            Priority
          </label>

          <select
            id="priority"
            value={selectedPriority}
            onChange={(event) => {
              setSelectedPriority(
                event.target.value
              );
              setError("");
            }}
            className="w-full cursor-pointer rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">
              Select priority
            </option>

            {priorityOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handlePriorityUpdate}
          disabled={loading}
          className="cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {loading
            ? "Updating..."
            : "Update Priority"}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
};

export default PrioritySection;