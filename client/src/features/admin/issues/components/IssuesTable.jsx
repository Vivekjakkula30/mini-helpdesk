import { useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LuEye } from "react-icons/lu";

import IssuesContext from "../../../../context/IssuesContext.jsx";
import CategoriesContext from "../../../../context/CategoriesContext.jsx";

const IssuesTable = ({ issues }) => {
  const navigate = useNavigate();

  const { page, setPage, pagination } =
    useContext(IssuesContext);

  const { categories } =
    useContext(CategoriesContext);

  const [searchParams] = useSearchParams();

  const showReopenedOnly =
    searchParams.get("reopened") === "true";

  const currentIssues = issues;

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (item) => item.id === Number(categoryId)
    );

    return category ? category.name : "Unknown";
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="border-b border-border bg-background/60">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
                ID
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Title
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Reporter
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Category
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Status
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Priority
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Assigned
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {currentIssues.map((issue) => (
              <tr
                key={issue.id}
                className="transition-colors duration-200 hover:bg-background/60"
              >
                <td className="whitespace-nowrap px-5 py-4 font-medium text-text-muted">
                  {issue.id}
                </td>

                <td className="max-w-[240px] px-5 py-4">
                  <p className="truncate font-medium text-text">
                    {issue.title}
                  </p>
                </td>

                <td className="px-5 py-4 text-text-muted">
                  {issue.reporterName || "Unknown"}
                </td>

                <td className="px-5 py-4 text-text-muted">
                  {getCategoryName(issue.categoryId)}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      issue.status === "OPEN"
                        ? "bg-blue-500/10 text-blue-500"
                        : issue.status === "IN_PROGRESS"
                        ? "bg-amber-500/10 text-amber-500"
                        : issue.status === "RESOLVED"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-slate-500/10 text-slate-500"
                    }`}
                  >
                    {issue.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  {issue.priority ? (
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        issue.priority === "HIGH"
                          ? "bg-red-500/10 text-red-500"
                          : issue.priority === "MEDIUM"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-emerald-500/10 text-emerald-500"
                      }`}
                    >
                      {issue.priority}
                    </span>
                  ) : (
                    <span className="text-text-muted">
                      —
                    </span>
                  )}
                </td>

                <td className="px-5 py-4 text-text-muted">
                  {issue.assignedAgentName || "Unassigned"}
                </td>

                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/admin/issues/${issue.id}`
                      )
                    }
                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors duration-200 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    title="View issue"
                    aria-label={`View issue ${issue.id}`}
                  >
                    <LuEye
                      size={18}
                      strokeWidth={1.9}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Normal Issues Pagination */}
      {!showReopenedOnly &&
        pagination?.totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-4">
            <button
              type="button"
              onClick={() =>
                setPage((page) => page - 1)
              }
              disabled={page === 1}
              className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-muted transition-colors duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-transparent disabled:hover:text-text-muted"
            >
              Previous
            </button>

            {Array.from(
              {
                length: pagination?.totalPages || 0,
              },
              (_, index) => index + 1
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  page === pageNumber
                    ? "border-primary bg-primary text-white"
                    : "border-border text-text-muted hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setPage((page) => page + 1)
              }
              disabled={
                page === pagination?.totalPages
              }
              className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-muted transition-colors duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-transparent disabled:hover:text-text-muted"
            >
              Next
            </button>
          </div>
        )}
    </div>
  );
};

export default IssuesTable;