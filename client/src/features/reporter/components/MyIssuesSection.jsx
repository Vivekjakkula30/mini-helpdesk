import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuEye } from "react-icons/lu";

import ReporterContext from "../../../context/ReporterContext.jsx";
import CategoriesContext from "../../../context/CategoriesContext.jsx";

const getStatusClass = (status) => {
  switch (status) {
    case "OPEN":
      return "bg-blue-500/10 text-blue-500";

    case "IN_PROGRESS":
      return "bg-yellow-500/10 text-yellow-500";

    case "RESOLVED":
      return "bg-green-500/10 text-green-500";

    case "CLOSED":
      return "bg-gray-500/10 text-gray-400";

    default:
      return "bg-gray-500/10 text-gray-400";
  }
};

const MyIssuesSection = () => {
  const {
    myIssues,
    loading,
    error,
    pagination,
    loadMyIssues,
  } = useContext(ReporterContext);

  const { categories } = useContext(CategoriesContext);

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = pagination?.totalPages || 0;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadMyIssues(page);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (category) => category.id === Number(categoryId)
    );

    return category?.name || "-";
  };

  if (loading) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-text">
            My Issues
          </h2>

          <p className="mt-2 text-sm text-text-muted">
            Loading your reported issues...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-text">
            My Issues
          </h2>

          <p className="mt-2 text-sm text-danger">
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (myIssues.length === 0) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-text">
            My Issues
          </h2>

          <p className="mt-2 text-sm text-text-muted">
            No issues found.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-text">
            My Issues
          </h2>

          <p className="mt-2 text-sm text-text-muted">
            Issues reported by you.
          </p>
        </div>

        <p className="text-sm font-medium text-text-muted">
          {pagination?.totalItems || 0} issues
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b border-border bg-background/60">
              <th className="w-[7%] px-3 py-4 text-left font-medium text-text-muted">
                ID
              </th>

              <th className="w-[16%] px-3 py-4 text-left font-medium text-text-muted">
                Issue
              </th>

              <th className="w-[14%] px-3 py-4 text-left font-medium text-text-muted">
                Category
              </th>

              <th className="w-[24%] px-3 py-4 text-left font-medium text-text-muted">
                Description
              </th>

              <th className="w-[13%] px-3 py-4 text-left font-medium text-text-muted">
                Status
              </th>

              <th className="w-[19%] px-3 py-4 text-left font-medium text-text-muted">
                Created
              </th>

              <th className="w-[7%] px-3 py-4 text-center font-medium text-text-muted">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {myIssues.map((issue) => (
              <tr
                key={issue.id}
                className="border-b border-border transition-colors duration-150 last:border-b-0 hover:bg-background/50"
              >
                <td className="whitespace-nowrap px-3 py-4 text-text">
                  {issue.id}
                </td>

                <td className="truncate px-3 py-4 font-medium text-text">
                  <p
                    className="truncate"
                    title={issue.title}
                  >
                    {issue.title}
                  </p>
                </td>

                <td className="truncate px-3 py-4 text-text">
                  <p
                    className="truncate"
                    title={getCategoryName(issue.categoryId)}
                  >
                    {getCategoryName(issue.categoryId)}
                  </p>
                </td>

                <td className="truncate px-3 py-4 text-text">
                  <p
                    className="truncate"
                    title={issue.description}
                  >
                    {issue.description}
                  </p>
                </td>

                <td className="px-3 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusClass(
                      issue.status
                    )}`}
                  >
                    {issue.status?.replace("_", " ")}
                  </span>
                </td>

                <td className="truncate whitespace-nowrap px-3 py-4 text-text">
                  {new Date(issue.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>

                <td className="px-3 py-4 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/reporter/issues/${issue.id}`)
                    }
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-colors duration-150 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    title="View Issue"
                    aria-label="View Issue"
                  >
                    <LuEye size={18} strokeWidth={1.9} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-6 py-4">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="cursor-pointer rounded-xl border border-border px-4 py-2 text-sm text-text-muted transition-colors duration-200 hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`h-9 min-w-9 cursor-pointer rounded-xl px-3 text-sm transition-colors duration-200 ${
                    currentPage === page
                      ? "bg-primary text-white"
                      : "text-text-muted hover:bg-background hover:text-primary"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="cursor-pointer rounded-xl border border-border px-4 py-2 text-sm text-text-muted transition-colors duration-200 hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
      
      </div>
    </section>
  );
};

export default MyIssuesSection;