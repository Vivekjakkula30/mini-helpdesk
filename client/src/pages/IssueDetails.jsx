import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  LuCalendarDays,
  LuClipboardList,
  LuClock3,
  LuFileText,
  LuInfo,
  LuArrowLeft,
  LuRefreshCcw,
  LuShieldCheck,
  LuUser,
  LuUserCheck,
} from "react-icons/lu";

import DiscussionSection from "../features/admin/discussions/components/DiscussionSection.jsx";

import {
  fetchIssueById,
  editIssue,
} from "../features/admin/issues/issues.service.js";

import {
  fetchAgentIssueById,
  updateAgentIssueStatus,
} from "../features/agent/dashboard/agentDashboard.service.js";

import Loading from "../components/common/Loading.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import AssignmentSection from "../features/admin/issues/components/AssignmentSection.jsx";
import PrioritySection from "../features/admin/issues/components/PrioritySection.jsx";

import CategoriesContext from "../context/CategoriesContext.jsx";

const formatDateTime = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getStatusClass = (status) => {
  switch (status) {
    case "OPEN":
      return "bg-blue-500/15 text-blue-500";

    case "IN_PROGRESS":
      return "bg-yellow-500/15 text-yellow-500";

    case "RESOLVED":
      return "bg-green-500/15 text-green-500";

    case "CLOSED":
      return "bg-gray-500/15 text-text-muted";

    default:
      return "bg-gray-500/15 text-text-muted";
  }
};

const getPriorityClass = (priority) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-500/15 text-red-500";

    case "MEDIUM":
      return "bg-yellow-500/15 text-yellow-500";

    case "LOW":
      return "bg-green-500/15 text-green-500";

    default:
      return "bg-gray-500/15 text-text-muted";
  }
};

const InfoItem = ({ icon: Icon, label, children }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-text-muted">
        <Icon size={17} strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p className="text-sm text-text-muted">{label}</p>

        <div className="mt-1 break-words text-sm font-medium text-text">
          {children}
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({ title, icon: Icon, children }) => {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon size={18} strokeWidth={1.8} />
        </div>

        <h2 className="text-base font-semibold text-text">{title}</h2>
      </div>

      {children}
    </section>
  );
};

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const { categories, loadCategories } = useContext(CategoriesContext);

  const [issue, setIssue] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");

  // Reference for Issue Information section
  const issueInformationRef = useRef(null);

  // Load issue details
  useEffect(() => {
    const loadIssue = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          user?.role === "AGENT"
            ? await fetchAgentIssueById(id)
            : await fetchIssueById(id);

        setIssue(data);
      } catch (error) {
        setError(error.message || "Failed to load issue.");
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
  }, [id, user?.role]);

  // Load categories required for category name
  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        await loadCategories();
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategoryData();
  }, [loadCategories]);

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (item) => Number(item.id) === Number(categoryId)
    );

    return category?.name || "Unknown";
  };

  const getStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case "OPEN":
        return [
          {
            value: "IN_PROGRESS",
            label: "In Progress",
          },
        ];

      case "IN_PROGRESS":
        return [
          {
            value: "RESOLVED",
            label: "Resolved",
          },
        ];

      case "RESOLVED":
        return [
          {
            value: "CLOSED",
            label: "Closed",
          },
        ];

      case "CLOSED":
        return [];

      default:
        return [];
    }
  };

  if (loading) {
    return (
      <main className="p-6">
        <Loading />
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <ErrorMessage message={error} />
      </main>
    );
  }

  if (!issue) {
    return null;
  }

  const canChangeStatus =
    (user?.role === "ADMIN" || user?.role === "AGENT") &&
    Number(issue.assignedId) === Number(user?.id);

  const statusOptions = getStatusOptions(issue.status);

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      setStatusError("Please select a status.");
      return;
    }

    try {
      setStatusLoading(true);
      setStatusError("");

      const updatedIssue =
        user?.role === "AGENT"
          ? await updateAgentIssueStatus(issue.id, selectedStatus)
          : await editIssue(issue.id, {
              status: selectedStatus,
            });

      setIssue(updatedIssue);
      toast.success("Status updated successfully");
      setSelectedStatus("");
    } catch (error) {
      toast.error(error.message || "Failed to update status.");
    } finally {
      setStatusLoading(false);
    }
  };

  // Handle successful assignment
  const handleAssignmentSuccess = (updatedIssue) => {
    setIssue(updatedIssue);

    setTimeout(() => {
      issueInformationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  };

  // Handle successful priority update
  const handlePrioritySuccess = (updatedIssue) => {
    setIssue(updatedIssue);

    setTimeout(() => {
      issueInformationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  };

  return (
    <main className="p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          {user?.role === "AGENT" && (
            <button
              type="button"
              onClick={() => navigate("/agent/issues")}
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-primary"
            >
              <LuArrowLeft size={18} strokeWidth={1.9} />
              Back to Available Issues
            </button>
          )}

          {user?.role === "ADMIN" && (
            <button
              type="button"
              onClick={() => navigate("/admin/issues")}
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-primary"
            >
              <LuArrowLeft size={18} strokeWidth={1.9} />
              Back to Issues
            </button>
          )}

          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LuClipboardList size={23} strokeWidth={1.8} />
            </div>

            <div>
              <p className="text-sm font-medium text-text-muted">
                Issue {issue.id}
              </p>

              <h1 className="mt-1 text-2xl font-semibold text-text">
                Issue Details
              </h1>

              <p className="mt-1 text-sm text-text-muted">
                View issue information, assignment details, and activity.
              </p>
            </div>
          </div>
        </div>

        {/* Issue Summary */}
        <SectionCard title="Issue Summary" icon={LuFileText}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <InfoItem icon={LuClipboardList} label="Issue ID">
              {issue.id}
            </InfoItem>

            <InfoItem icon={LuFileText} label="Title">
              {issue.title}
            </InfoItem>

            <InfoItem icon={LuInfo} label="Category">
              {getCategoryName(issue.categoryId)}
            </InfoItem>

            <InfoItem icon={LuShieldCheck} label="Status">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                    issue.status
                  )}`}
                >
                  {issue.status}
                </span>

                {Number(issue.reopened) === 1 && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Reopened
                  </span>
                )}
              </div>

              {canChangeStatus && statusOptions.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(event) => {
                      setSelectedStatus(event.target.value);
                      setStatusError("");
                    }}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Change status</option>

                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleStatusUpdate}
                    disabled={statusLoading}
                    className="cursor-pointer rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {statusLoading ? "Updating..." : "Update"}
                  </button>
                </div>
              )}

              {canChangeStatus && issue.status === "CLOSED" && (
                <p className="mt-2 text-xs text-text-muted">
                  This issue is closed and cannot be moved.
                </p>
              )}

              {statusError && (
                <div className="mt-2">
                  <ErrorMessage message={statusError} />
                </div>
              )}
            </InfoItem>
          </div>
        </SectionCard>

        {/* Description */}
        <SectionCard title="Description" icon={LuFileText}>
          <p className="whitespace-pre-wrap text-sm leading-7 text-text">
            {issue.description || "No description provided."}
          </p>
        </SectionCard>

        {/* Reopen Information */}
        {Number(issue.reopened) === 1 && (
          <SectionCard title="Reopen Information" icon={LuRefreshCcw}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <InfoItem icon={LuInfo} label="Reopen Reason">
                  {issue.reopenReason || "—"}
                </InfoItem>
              </div>

              <InfoItem icon={LuUser} label="Reopened By">
                {issue.reopenedByName || "—"}
              </InfoItem>

              <InfoItem icon={LuCalendarDays} label="Reopened At">
                {formatDateTime(issue.reopenedAt)}
              </InfoItem>
            </div>
          </SectionCard>
        )}

        {/* Issue Information */}
        <div ref={issueInformationRef}>
          <SectionCard title="Issue Information" icon={LuInfo}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InfoItem icon={LuShieldCheck} label="Priority">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityClass(
                    issue.priority
                  )}`}
                >
                  {issue.priority || "Not set"}
                </span>
              </InfoItem>

              <InfoItem icon={LuUser} label="Reporter">
                {issue.reporterName || "—"}
              </InfoItem>

              <InfoItem icon={LuUserCheck} label="Assigned Agent">
                {issue.assignedAgentName || "Unassigned"}
              </InfoItem>

              <InfoItem icon={LuUser} label="Assigned By">
                {issue.assignedByName || "—"}
              </InfoItem>

              <InfoItem icon={LuCalendarDays} label="Created At">
                {formatDateTime(issue.createdAt)}
              </InfoItem>

              <InfoItem icon={LuClock3} label="Updated At">
                {formatDateTime(issue.updatedAt)}
              </InfoItem>
            </div>
          </SectionCard>
        </div>

        {/* Priority Section */}
        <PrioritySection
          issue={issue}
          user={user}
          onPrioritySuccess={handlePrioritySuccess}
        />

        {/* Assignment Section */}
        <AssignmentSection
          issue={issue}
          user={user}
          onAssignmentSuccess={handleAssignmentSuccess}
        />

        {/* Discussion Section */}
        <DiscussionSection issue={issue} user={user} />
      </div>
    </main>
  );
};

export default IssueDetails;