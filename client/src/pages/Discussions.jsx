import { useEffect, useState } from "react";

import {
  fetchDiscussionsByIssueId,
} from "../features/admin/discussions/discussions.service.js";

import { fetchIssues } from "../features/admin/issues/issues.service.js";

import Loading from "../components/common/Loading.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";

const Discussions = () => {
  const [discussions, setDiscussions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const loadDiscussions = async () => {
    try {
      setLoading(true);
      setError("");

      const issues = await fetchIssues();

      const discussionResults = await Promise.all(
        issues.map((issue) =>
          fetchDiscussionsByIssueId(issue.id)
        )
      );

      const allDiscussions = discussionResults.flat();

      setDiscussions(allDiscussions);
    } catch (error) {
      setError(
        error.message || "Failed to load discussions."
      );
    } finally {
      setLoading(false);
    }
  };

  loadDiscussions();
}, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">
          Discussions
        </h1>

        <p className="text-sm text-text-muted mt-1">
          View discussions across all issues.
        </p>
      </div>

      {discussions.length === 0 ? (
        <section className="bg-surface border border-border rounded-card p-5">
          <p className="text-sm text-text-muted">
            No discussions available.
          </p>
        </section>
      ) : (
        <section className="bg-surface border border-border rounded-card p-5">
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div
                key={discussion.id}
                className="border border-border rounded-input p-4"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-medium text-text">
                      Issue #{discussion.issueId}
                    </p>

                    <p className="text-xs text-text-muted">
                      {discussion.senderName} ·{" "}
                      {discussion.senderRole}
                    </p>
                  </div>

                  <p className="text-xs text-text-muted">
                    {new Date(
                      discussion.createdAt
                    ).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>

                <p className="text-sm text-text leading-5">
                  {discussion.message}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Discussions;