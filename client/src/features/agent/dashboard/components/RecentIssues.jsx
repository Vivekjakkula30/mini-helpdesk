import { useNavigate } from "react-router-dom";

const formatDateTime = (date) => {
  if (!date) {
    return "—";
  }

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

const RecentIssues = ({ issues = [] }) => {
  const navigate = useNavigate();

  const handleViewIssue = (issueId) => {
    navigate(`/agent/issues/${issueId}`);
  };

  return (
    <section className="bg-surface border border-border rounded-card p-5">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-text">
          Recent Issues
        </h2>

        <p className="text-sm text-text-muted mt-1">
          Recently created issues across the helpdesk.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="px-0 py-3 text-sm font-medium text-text-muted">
                ID
              </th>

              <th className="px-4 py-3 text-sm font-medium text-text-muted">
                Title
              </th>

              <th className="px-4 py-3 text-sm font-medium text-text-muted">
                Status
              </th>

              <th className="px-4 py-3 text-sm font-medium text-text-muted">
                Priority
              </th>

              <th className="px-4 py-3 text-sm font-medium text-text-muted">
                Assigned To
              </th>

              <th className="px-4 py-3 text-sm font-medium text-text-muted">
                Created At
              </th>

              <th className="px-4 py-3 text-sm font-medium text-text-muted">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {issues.length > 0 ? (
              issues.map((issue) => (
                <tr
                  key={issue.id}
                  className="border-b border-border transition-colors hover:bg-surface-secondary"
                >
                  <td className="px-0 py-4 text-sm text-text">
                    {issue.id}
                  </td>

                  <td className="px-4 py-4 text-sm text-text">
                    {issue.title}
                  </td>

                  <td className="px-4 py-4 text-sm text-text">
                    {issue.status}
                  </td>

                  <td className="px-4 py-4 text-sm text-text">
                    {issue.priority || "—"}
                  </td>

                  <td className="px-4 py-4 text-sm text-text">
                    {issue.assignedId || "Unassigned"}
                  </td>

                  <td className="px-4 py-4 text-sm text-text-muted whitespace-nowrap">
                    {formatDateTime(issue.createdAt)}
                  </td>

                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => handleViewIssue(issue.id)}
                      title="View issue"
                      aria-label={`View issue ${issue.id}`}
                      className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-input transition-colors hover:bg-primary hover:text-white cursor-pointer"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>

                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-0 py-8 text-center text-sm text-text-muted"
                >
                  No recent issues found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentIssues;