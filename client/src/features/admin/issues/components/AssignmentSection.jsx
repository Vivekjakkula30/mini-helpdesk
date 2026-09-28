import { useEffect, useState } from "react";
import { LuUserRound, LuUsersRound } from "react-icons/lu";
import { toast } from "react-toastify";
import {
  assignIssue,
  fetchAgents,
} from "../issues.service.js";

import {
  selfAssignIssue,
  assignIssueToAgent,
} from "../../../agent/dashboard/agentDashboard.service.js";

const AssignmentSection = ({
  issue,
  user,
  onAssignmentSuccess,
}) => {
  const [agents, setAgents] = useState([]);

  const [selectedUser, setSelectedUser] = useState(
    issue?.assignedId
      ? String(issue.assignedId)
      : ""
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [showUsers, setShowUsers] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const data = await fetchAgents();
        setAgents(data);
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      }
    };

    loadAgents();
  }, []);

  const normalizedSearchTerm = searchTerm
    .trim()
    .toLowerCase();

  const isAdmin = user?.role === "ADMIN";
  const isAgent = user?.role === "AGENT";

  const isIssueAssigned = Boolean(issue?.assignedId);

const filteredAgents = agents.filter((agent) => {
  const matchesSearch = agent.name
    .toLowerCase()
    .includes(normalizedSearchTerm);

  const isCurrentAgent =
    isAgent &&
    Number(agent.id) === Number(user?.id);

  return matchesSearch && !isCurrentAgent;
});

  const selectedUserId =
    selectedUser ||
    (issue?.assignedId
      ? String(issue.assignedId)
      : "");

  const selectedUserData = agents.find(
    (agent) =>
      String(agent.id) === selectedUserId
  );

  const selectedUserName =
    selectedUserData?.name ||
    (String(user?.id) === selectedUserId
      ? user?.name
      : "") ||
    issue?.assignedAgentName ||
    "";

  const canAgentAssign =
    isAgent &&
    !isIssueAssigned &&
    Boolean(selectedUserId);

  const canAssignIssue =
    isAdmin || canAgentAssign;

  const showAssignToMe =
    normalizedSearchTerm.length > 0 &&
    user?.name
      ?.toLowerCase()
      .includes(normalizedSearchTerm);

  const handleUserSelect = (value) => {
    setSelectedUser(String(value));
    setSearchTerm("");
    setShowUsers(false);
    setError("");
  };

  const handleAssignment = async () => {
    if (isAgent && isIssueAssigned) {
      setError(
        "This issue is already assigned and cannot be reassigned."
      );
      return;
    }

    if (!selectedUserId) {
      setError("Please select an agent.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let updatedIssue;

      if (isAgent) {
        if (
          String(selectedUserId) ===
          String(user?.id)
        ) {
          // Agent assigns the issue to himself
          updatedIssue = await selfAssignIssue(
            issue.id
          );
        } else {
          // Agent assigns the issue to another agent
          updatedIssue =
            await assignIssueToAgent(
              issue.id,
              selectedUserId
            );
        }
      } else {
        // Admin assigns the issue to an agent
        updatedIssue = await assignIssue(
          issue.id,
          selectedUserId,
          user.id
        );
      }

      toast.success("Issue assigned successfully");
      onAssignmentSuccess(updatedIssue);
    } catch (error) {
      setError(
        error.message ||
          "Failed to assign issue."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LuUsersRound
            size={20}
            strokeWidth={1.9}
          />
        </div>

        <div>
          <h2 className="text-base font-semibold text-text">
            Assignment
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Assign this issue to an agent or yourself.
          </p>
        </div>
      </div>

      {isAgent && isIssueAssigned && (
        <p className="rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm text-text-muted">
          This issue is already assigned and cannot
          be reassigned.
        </p>
      )}

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
        <div className="relative w-full sm:w-64">
          <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-text-muted">
            <LuUserRound
              size={17}
              strokeWidth={1.8}
            />
          </div>

          <input
            type="text"
            value={
              showUsers
                ? searchTerm
                : selectedUserName
            }
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setShowUsers(true);
              setError("");
            }}
            onFocus={() => {
              setShowUsers(true);
              setSearchTerm("");
            }}
            placeholder="Search agent"
            disabled={
              isAgent && isIssueAssigned
            }
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-text outline-none transition-colors placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          />

          {showUsers &&
            normalizedSearchTerm.length > 0 && (
              <div className="absolute z-10 mt-2 max-h-52 w-full overflow-y-auto rounded-xl border border-border bg-surface py-1 shadow-lg">

                {/* Assign to Me */}
                {showAssignToMe && (
                  <button
                    type="button"
                    onClick={() =>
                      handleUserSelect(user.id)
                    }
                    className="block w-full cursor-pointer px-3 py-2.5 text-left text-sm text-text transition-colors hover:bg-background"
                  >
                    Assign to Me ({user.name})
                  </button>
                )}

                {/* Admin and Agent can select agents */}
                {(isAdmin || isAgent) &&
                  filteredAgents.map(
                    (agent) => (
                      <button
                        type="button"
                        key={agent.id}
                        onClick={() =>
                          handleUserSelect(
                            agent.id
                          )
                        }
                        className="block w-full cursor-pointer px-3 py-2.5 text-left text-sm text-text transition-colors hover:bg-background"
                      >
                        {agent.name}
                      </button>
                    )
                  )}

                {!showAssignToMe &&
                  filteredAgents.length === 0 && (
                    <p className="px-3 py-2.5 text-sm text-text-muted">
                      No agents found.
                    </p>
                  )}
              </div>
            )}
        </div>

        <button
          type="button"
          onClick={handleAssignment}
          disabled={
            loading ||
            !canAssignIssue ||
            !selectedUserId
          }
          className="cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {loading
            ? "Assigning..."
            : "Assign"}
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-danger/20 bg-danger/10 px-3 py-2.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
};

export default AssignmentSection;