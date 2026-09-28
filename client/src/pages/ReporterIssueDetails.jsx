import {
  useEffect,
  useState,
  useContext,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  LuCalendarDays,
  LuClipboardList,
  LuClock3,
  LuFileText,
  LuInfo,
  LuArrowLeft,
  LuShieldCheck,
  LuUserCheck,
} from "react-icons/lu";

import {
  fetchReporterIssueById,
  reopenIssue,
} from "../features/reporter/reporter.service.js";

import CategoriesContext from "../context/CategoriesContext.jsx";
import FieldError from "../components/common/FieldError.jsx";

import { toast } from "react-toastify";


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


const InfoItem = ({
  icon: Icon,
  label,
  children,
}) => {

  return (
    <div className="flex items-start gap-3">

      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background text-text-muted">

        <Icon
          size={17}
          strokeWidth={1.8}
        />

      </div>

      <div className="min-w-0">

        <p className="text-sm text-text-muted">
          {label}
        </p>

        <div className="mt-1 break-words text-sm font-medium text-text">
          {children}
        </div>

      </div>

    </div>
  );
};


const SectionCard = ({
  title,
  icon: Icon,
  children,
}) => {

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">

      <div className="mb-5 flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">

          <Icon
            size={18}
            strokeWidth={1.8}
          />

        </div>

        <h2 className="text-base font-semibold text-text">
          {title}
        </h2>

      </div>

      {children}

    </section>
  );
};


const ReporterIssueDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();


  const {
    categories,
    loadCategories,
  } = useContext(CategoriesContext);


  const [issue, setIssue] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [isReopening, setIsReopening] =
    useState(false);

  const [reopenReason, setReopenReason] =
    useState("");

  const [reopenError, setReopenError] =
    useState("");


  // Load categories when Issue Details page opens
  useEffect(() => {

    const loadCategoryData = async () => {

      try {

        await loadCategories();

      } catch (error) {

        console.error(
          "Failed to load categories:",
          error
        );

      }

    };

    loadCategoryData();

  }, [loadCategories]);


  // Load reporter issue
  useEffect(() => {

    const loadIssue = async () => {

      try {

        setLoading(true);
        setError("");

        const user = JSON.parse(
          localStorage.getItem("user")
        );

        if (!user?.id) {

          setError(
            "Reporter information not found."
          );

          return;
        }

        const data =
          await fetchReporterIssueById(
            id,
            user.id
          );

        setIssue(data);

      } catch (error) {

        setError(
          error.message ||
            "Failed to load issue."
        );

      } finally {

        setLoading(false);

      }

    };

    loadIssue();

  }, [id]);


  const getCategoryName = (categoryId) => {

    const category = categories.find(
      (item) =>
        Number(item.id) ===
        Number(categoryId)
    );

    return category?.name || "Unknown";
  };


  const handleReopen = async () => {

    setReopenError("");

    if (!reopenReason.trim()) {

      setReopenError(
        "Reason for reopening is required."
      );

      return;
    }

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user?.id) {

        setReopenError(
          "Reporter information not found."
        );

        return;
      }

      const updatedIssue =
        await reopenIssue(
          issue.id,
          reopenReason
        );

      setIssue({
        ...issue,
        ...updatedIssue,
      });

      toast.success(
        "Issue reopened successfully."
      );

      setIsReopening(false);

      setReopenReason("");

      setReopenError("");

    } catch (error) {

      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message ||
            error?.error?.message ||
            error?.error ||
            "Failed to reopen issue.";

      setReopenError(
        typeof errorMessage === "string"
          ? errorMessage
          : "Failed to reopen issue."
      );
    }
  };


  if (loading) {

    return (
      <main className="p-6">

        <p className="text-sm text-text-muted">
          Loading...
        </p>

      </main>
    );
  }


  if (error) {

    return (
      <main className="p-6">

        <p className="text-sm text-danger">
          {error}
        </p>

      </main>
    );
  }


  if (!issue) {
    return null;
  }


  return (
    <main className="p-6">

      <div className="mx-auto max-w-5xl space-y-6">

        {/* Page Header */}

        <div className="space-y-4">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/reporter/dashboard"
              )
            }
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-primary"
          >

            <LuArrowLeft
              size={18}
              strokeWidth={1.9}
            />

            Back to Dashboard

          </button>


          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

              <LuClipboardList
                size={23}
                strokeWidth={1.8}
              />

            </div>


            <div>

              <p className="text-sm font-medium text-text-muted">
                Issue {issue.id}
              </p>

              <h1 className="mt-1 text-2xl font-semibold text-text">
                Issue Details
              </h1>

              <p className="mt-1 text-sm text-text-muted">
                View issue information and assignment details.
              </p>

            </div>

          </div>

        </div>


        {/* Issue Summary */}

        <SectionCard
          title="Issue Summary"
          icon={LuFileText}
        >

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            <InfoItem
              icon={LuClipboardList}
              label="Issue ID"
            >
              {issue.id}
            </InfoItem>


            <InfoItem
              icon={LuFileText}
              label="Title"
            >
              {issue.title}
            </InfoItem>


            <InfoItem
              icon={LuInfo}
              label="Category"
            >
              {getCategoryName(
                issue.categoryId
              )}
            </InfoItem>


            <InfoItem
              icon={LuShieldCheck}
              label="Status"
            >

              <div className="flex flex-wrap items-center gap-2">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                    issue.status
                  )}`}
                >
                  {issue.status}
                </span>


                {(issue.status === "RESOLVED" ||
                  issue.status === "CLOSED") && (

                  <button
                    type="button"
                    onClick={() => {

                      setIsReopening(true);

                      setReopenError("");

                    }}
                    className="cursor-pointer rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
                  >
                    Reopen
                  </button>

                )}

              </div>

            </InfoItem>

          </div>


          {/* Reopen Form */}

          {isReopening && (

            <div className="mt-5 border-t border-border pt-5">

              <label
                htmlFor="reopenReason"
                className="mb-2 block text-sm font-medium text-text"
              >
                Reason for reopening
              </label>


              <textarea
                id="reopenReason"
                rows="4"
                value={reopenReason}
                onChange={(event) => {

                  setReopenReason(
                    event.target.value
                  );

                  if (reopenError) {
                    setReopenError("");
                  }

                }}
                placeholder="Explain why you want to reopen this issue"
                className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary"
              />


              <FieldError
                message={reopenError}
              />


              <div className="mt-3 flex items-center gap-2">

                <button
                  type="button"
                  onClick={() => {

                    setIsReopening(false);

                    setReopenReason("");

                    setReopenError("");

                  }}
                  className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition-colors hover:text-text"
                >
                  Cancel
                </button>


                <button
                  type="button"
                  onClick={handleReopen}
                  className="cursor-pointer rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:brightness-90"
                >
                  Reopen Issue
                </button>

              </div>

            </div>

          )}

        </SectionCard>


        {/* Description */}

        <SectionCard
          title="Description"
          icon={LuFileText}
        >

          <p className="whitespace-pre-wrap text-sm leading-7 text-text">

            {issue.description ||
              "No description provided."}

          </p>

        </SectionCard>


        {/* Issue Information */}

        <SectionCard
          title="Issue Information"
          icon={LuInfo}
        >

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Priority */}

            <InfoItem
              icon={LuShieldCheck}
              label="Priority"
            >

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityClass(
                  issue.priority
                )}`}
              >
                {issue.priority ||
                  "Not set"}
              </span>

            </InfoItem>


            {/* Assigned Agent */}

            <InfoItem
              icon={LuUserCheck}
              label="Assigned Agent"
            >

              {issue.assignedAgentName ||
                "Unassigned"}

            </InfoItem>


            {/* Created At */}

            <InfoItem
              icon={LuCalendarDays}
              label="Created At"
            >

              {formatDateTime(
                issue.createdAt
              )}

            </InfoItem>


            {/* Updated At */}

            <InfoItem
              icon={LuClock3}
              label="Updated At"
            >

              {formatDateTime(
                issue.updatedAt
              )}

            </InfoItem>

          </div>

        </SectionCard>

      </div>

    </main>
  );
};


export default ReporterIssueDetails;