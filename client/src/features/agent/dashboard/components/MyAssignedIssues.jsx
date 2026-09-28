import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LuEye, LuInbox, LuArrowRight } from "react-icons/lu";

import CategoriesContext from "../../../../context/CategoriesContext.jsx";

const MyAssignedIssues = ({ issues = [] }) => {
  const { categories } = useContext(CategoriesContext);
  const navigate = useNavigate();

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (category) =>
        Number(category.id) === Number(categoryId)
    );

    return category?.name || "Unknown";
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

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">
            My Assigned Issues
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Recently assigned issues that require your attention.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/agent/issues")}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-background hover:text-primary"
        >
          View All
          <LuArrowRight size={16} strokeWidth={1.9} />
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  ID
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Issue
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Priority
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {issues.length > 0 ? (
                issues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="transition-colors hover:bg-background"
                  >
                    <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-text">
                      {issue.id}
                    </td>

                    <td className="px-6 py-5">
                      <div className="max-w-xs truncate font-semibold text-text">
                        {issue.title}
                      </div>

                      <div className="mt-1 max-w-xs truncate text-xs text-text-muted">
                        {issue.description}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-text">
                      {getCategoryName(issue.categoryId)}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityClass(
                          issue.priority
                        )}`}
                      >
                        {issue.priority || "Not set"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          issue.status
                        )}`}
                      >
                        {issue.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/agent/issues/${issue.id}`)
                        }
                        title="View issue"
                        aria-label={`View issue ${issue.id}`}
                        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <LuEye size={19} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-background text-text-muted">
                        <LuInbox size={24} strokeWidth={1.8} />
                      </div>

                      <p className="text-sm font-medium text-text">
                        No assigned issues found
                      </p>

                      <p className="mt-1 text-sm text-text-muted">
                        You currently have no issues assigned to you.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default MyAssignedIssues;