import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuArrowRight, LuEye, LuInbox,
} from "react-icons/lu";

import CategoriesContext from "../../../../context/CategoriesContext";

const RecentIssuesSection = ({ issues = [] }) => {
  const { categories } = useContext(CategoriesContext);
  const navigate = useNavigate();

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (category) => category.id === Number(categoryId)
    );

    return category?.name ?? "—";
  };

  const getPriorityClass = (priority) => {
    const priorityClasses = {
      HIGH: "bg-red-500/10 text-red-500",
      MEDIUM: "bg-orange-500/10 text-orange-500",
      LOW: "bg-green-500/10 text-green-500",
    };

    return priorityClasses[priority] || "bg-background text-text-muted";
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      OPEN: "bg-blue-500/10 text-blue-500",
      IN_PROGRESS: "bg-amber-500/10 text-amber-500",
      RESOLVED: "bg-emerald-500/10 text-emerald-500",
      CLOSED: "bg-slate-500/10 text-slate-500",
    };

    return statusClasses[status] || "bg-background text-text-muted";
  };

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-text">
            Recent Issues
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Latest issues reported by users.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/issues")}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-background hover:text-primary"
        >
          View All
          <LuArrowRight size={16} strokeWidth={1.9} />
        </button>
      </div>

      <div className="overflow-x-auto rounded-card border border-border bg-surface">
        {issues.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-text-muted">
              <LuInbox size={24} strokeWidth={1.8} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-text">
              No recent issues
            </h3>

            <p className="mt-1 max-w-sm text-sm text-text-muted">
              There are no recently reported issues to display.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border bg-background/50">
              <tr>
                <th className="px-4 py-3 font-medium text-text-muted">
                  ID
                </th>

                <th className="px-4 py-3 font-medium text-text-muted">
                  Title
                </th>

                <th className="px-4 py-3 font-medium text-text-muted">
                  Reporter
                </th>

                <th className="px-4 py-3 font-medium text-text-muted">
                  Category
                </th>

                <th className="px-4 py-3 font-medium text-text-muted">
                  Priority
                </th>

                <th className="px-4 py-3 font-medium text-text-muted">
                  Status
                </th>

                <th className="px-4 py-3 font-medium text-text-muted">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {issues.map((issue) => (
                <tr
                  key={issue.id}
                  className="border-b border-border last:border-b-0 hover:bg-background/40"
                >
                  <td className="px-4 py-3 font-medium text-text">
                    {issue.id}
                  </td>

                  <td className="max-w-xs px-4 py-3">
                    <p className="truncate font-medium text-text">
                      {issue.title}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-text">
                    {issue.reporterName || "-"}
                  </td>

                  <td className="px-4 py-3 text-text">
                    {getCategoryName(issue.categoryId)}
                  </td>

                  <td className="px-4 py-3">
                    {issue.priority ? (
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClass(
                          issue.priority
                        )}`}
                      >
                        {issue.priority}
                      </span>
                    ) : (
                      <span className="text-text-muted">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                        issue.status
                      )}`}
                    >
                      {issue.status.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/admin/issues/${issue.id}`)
                      }
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-colors duration-200 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      title="View issue"
                      aria-label={`View issue ${issue.id}`}
                    >
                      <LuEye size={18} strokeWidth={1.9} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default RecentIssuesSection;