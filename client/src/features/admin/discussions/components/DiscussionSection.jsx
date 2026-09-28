import { useEffect, useState } from "react";
import { LuMessageCircle, LuSend, LuUserRound } from "react-icons/lu";

import {
  fetchDiscussionsByIssueId,
  addDiscussion,
} from "../discussions.service.js";

import Loading from "../../../../components/common/Loading.jsx";
import ErrorMessage from "../../../../components/common/ErrorMessage.jsx";

const DiscussionSection = ({ issue, user }) => {
  const [discussions, setDiscussions] = useState([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [messageError, setMessageError] = useState("");

  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchDiscussionsByIssueId(issue.id);
        setDiscussions(data);
      } catch (error) {
        setError(
          error.message || "Failed to load discussions."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDiscussions();
  }, [issue.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      setMessageError("Please enter a message.");
      return;
    }

    try {
      setSending(true);
      setMessageError("");

      const newDiscussion = await addDiscussion(issue.id, {
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        message,
      });

      setDiscussions((previousDiscussions) => [
        ...previousDiscussions,
        newDiscussion,
      ]);

      setMessage("");
    } catch (error) {
      setMessageError(
        error.message || "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="space-y-5 rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LuMessageCircle size={20} strokeWidth={1.9} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-text">
            Discussion
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Communicate with other users about this issue.
          </p>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          {discussions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-background/50 px-4 py-6 text-center">
              <LuMessageCircle
                size={24}
                strokeWidth={1.7}
                className="mx-auto mb-2 text-text-muted"
              />

              <p className="text-sm text-text-muted">
                No discussions available for this issue.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {discussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className="rounded-xl border border-border bg-background/40 p-4 transition-colors hover:bg-background/70"
                >
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <LuUserRound size={17} strokeWidth={1.8} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-text">
                          {discussion.senderName}
                        </p>

                        <p className="text-xs text-text-muted">
                          {discussion.senderRole}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-text-muted sm:text-right">
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

                  <p className="whitespace-pre-wrap text-sm leading-6 text-text">
                    {discussion.message}
                  </p>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-3 border-t border-border pt-5"
          >
            <label
              htmlFor="discussion-message"
              className="block text-sm font-medium text-text"
            >
              Add a message
            </label>

            <textarea
              id="discussion-message"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setMessageError("");
              }}
              placeholder="Write a message..."
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            {messageError && (
              <ErrorMessage message={messageError} />
            )}

            <button
              type="submit"
              disabled={sending}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <LuSend size={16} strokeWidth={1.9} />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </>
      )}
    </section>
  );
};

export default DiscussionSection;