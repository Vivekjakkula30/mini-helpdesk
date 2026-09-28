import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuChevronLeft,
  LuChevronRight,
  LuClipboardList,
  LuEye,
  LuInbox,
  LuRotateCcw,
  LuSearch,
  LuTicket,
} from "react-icons/lu";

import CategoriesContext from "../../../context/CategoriesContext.jsx";
import { fetchAssignedIssues } from "../dashboard/agentDashboard.service.js";

const ITEMS_PER_PAGE = 10;

const AgentIssues = () => {
  const { categories } = useContext(CategoriesContext);
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    assignment: "assigned",
    search: "",
    status: "",
    priority: "",
    categoryId: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (item) =>
        Number(item.id) === Number(categoryId)
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

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchAssignedIssues(
          currentPage,
          ITEMS_PER_PAGE,
          filters
        );

        setIssues(data?.issues || []);

        setPagination({
          currentPage:
            data?.currentPage || currentPage,
          totalPages:
            data?.totalPages || 1,
          totalItems:
            data?.totalItems || 0,
        });
      } catch (error) {
        console.error(
          "Failed to load agent issues:",
          error
        );

        setIssues([]);

        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
        });

        setError(
          error?.message ||
            "Failed to load issues."
        );
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, [currentPage, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      [field]: value,
    }));

    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      assignment: "assigned",
      search: "",
      status: "",
      priority: "",
      categoryId: "",
    });

    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) =>
      Math.max(page - 1, 1)
    );
  };

  const goToNextPage = () => {
    setCurrentPage((page) =>
      Math.min(
        page + 1,
        pagination.totalPages
      )
    );
  };

  return (
    <main className="p-4 sm:p-6">
      <div className="space-y-8">

        {/* Page Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LuClipboardList
              size={23}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-text">
              Issues
            </h1>
          </div>
        </div>

        {/* Filters */}
        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">

            {/* Assignment */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">
                Assignment
              </label>

              <select
                value={filters.assignment}
                onChange={(event) =>
                  handleFilterChange(
                    "assignment",
                    event.target.value
                  )
                }
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-text outline-none transition-colors focus:border-primary"
              >
                <option value="all">
                  All Issues
                </option>

                <option value="available">
                  Available Issues
                </option>

                <option value="assigned">
                  My Assigned Issues
                </option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">
                Search
              </label>

              <div className="relative">
                <LuSearch
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="text"
                  value={filters.search}
                  onChange={(event) =>
                    handleFilterChange(
                      "search",
                      event.target.value
                    )
                  }
                  placeholder="Search issues..."
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-primary"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">
                Status
              </label>

              <select
                value={filters.status}
                onChange={(event) =>
                  handleFilterChange(
                    "status",
                    event.target.value
                  )
                }
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-text outline-none transition-colors focus:border-primary"
              >
                <option value="">
                  All Status
                </option>

                <option value="OPEN">
                  Open
                </option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>

                <option value="RESOLVED">
                  Resolved
                </option>

                <option value="CLOSED">
                  Closed
                </option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">
                Priority
              </label>

              <select
                value={filters.priority}
                onChange={(event) =>
                  handleFilterChange(
                    "priority",
                    event.target.value
                  )
                }
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-text outline-none transition-colors focus:border-primary"
              >
                <option value="">
                  All Priorities
                </option>

                <option value="HIGH">
                  High
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="LOW">
                  Low
                </option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">
                Category
              </label>

              <select
                value={filters.categoryId}
                onChange={(event) =>
                  handleFilterChange(
                    "categoryId",
                    event.target.value
                  )
                }
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-text outline-none transition-colors focus:border-primary"
              >
                <option value="">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border px-3 text-sm text-text transition-colors hover:bg-background"
            >
              <LuRotateCcw size={15} />
              Reset Filters
            </button>
          </div>
        </section>

        {/* Issues Table */}
        <section className="overflow-hidden rounded-2xl border border-border bg-surface">

          {/* Card Header */}
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-text-muted">
                <LuTicket
                  size={18}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h2 className="text-base font-semibold text-text">
                  Agent Issues
                </h2>

                <p className="mt-0.5 text-xs text-text-muted">
                  {pagination.totalItems} issue
                  {pagination.totalItems !== 1
                    ? "s"
                    : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="border-b border-border px-5 py-4">
              <p className="rounded-xl border border-danger/20 bg-danger/10 px-3 py-2.5 text-sm text-danger">
                {error}
              </p>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-[850px] w-full">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                    ID
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Issue
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Category
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Priority
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Status
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-14 text-center"
                    >
                      <p className="text-sm text-text-muted">
                        Loading issues...
                      </p>
                    </td>
                  </tr>
                ) : issues.length > 0 ? (
                  issues.map((issue) => (
                    <tr
                      key={issue.id}
                      className="border-b border-border transition-colors last:border-b-0 hover:bg-background"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-text">
                        {issue.id}
                      </td>

                      <td className="px-5 py-4">
                        <div className="max-w-xs truncate text-sm font-semibold text-text">
                          {issue.title}
                        </div>

                        <div className="mt-1 max-w-xs truncate text-xs text-text-muted">
                          {issue.description}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-text">
                        {getCategoryName(
                          issue.categoryId
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClass(
                            issue.priority
                          )}`}
                        >
                          {issue.priority ||
                            "Not set"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                            issue.status
                          )}`}
                        >
                          {issue.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/agent/issues/${issue.id}`
                            )
                          }
                          title="View issue"
                          aria-label={`View issue ${issue.id}`}
                          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          <LuEye
                            size={19}
                            strokeWidth={1.9}
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-14 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-background text-text-muted">
                          <LuInbox
                            size={24}
                            strokeWidth={1.8}
                          />
                        </div>

                        <p className="text-sm font-medium text-text">
                          No issues found
                        </p>

                        <p className="mt-1 text-sm text-text-muted">
                          Try changing your filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && (
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-5 py-4">
              <p className="text-sm text-text-muted">
                Page {pagination.currentPage} of{" "}
                {pagination.totalPages}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-lg border border-border px-3 text-sm text-text transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LuChevronLeft size={16} />
                  Previous
                </button>

                {Array.from(
                  {
                    length:
                      pagination.totalPages,
                  },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`h-9 min-w-9 cursor-pointer rounded-lg px-3 text-sm transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "border border-border text-text hover:bg-background"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={
                    currentPage ===
                    pagination.totalPages
                  }
                  className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-lg border border-border px-3 text-sm text-text transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <LuChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AgentIssues;