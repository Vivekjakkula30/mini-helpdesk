import fetchService from "../../../services/fetchService.js";

export const fetchAssignedIssues = async (
  page = 1,
  limit = 10,
  filters = {}
) => {
  const {
    assignment = "assigned",
    search = "",
    status = "",
    priority = "",
    categoryId = "",
  } = filters;

  const params = new URLSearchParams({
    page,
    limit,
    assignment,
    search,
    status,
    priority,
    categoryId,
  });

  return await fetchService(`/agents/issues?${params.toString()}`);
};

export const fetchAvailableIssues = async (page = 1, limit = 10) => {
  return await fetchService(
    `/agents/available-issues?page=${page}&limit=${limit}`
  );
};

export const fetchAgentIssueById = async (issueId) => {
  return await fetchService(`/agents/issues/${issueId}`);
};

export const updateAgentIssueStatus = async (issueId, status) => {
  return await fetchService(`/agents/issues/${issueId}/status`, {
    method: "PUT",
    body: { status },
  });
};

export const selfAssignIssue = async (issueId) => {
  return await fetchService(`/agents/issues/${issueId}/self-assign`, {
    method: "PUT",
  });
};

export const assignIssueToAgent = async (issueId, agentId) => {
  return await fetchService(`/agents/issues/${issueId}/assign`, {
    method: "PUT",
    body: {
      agentId,
    },
  });
};

export const updateAgentIssuePriority = async (
  issueId,
  priority
) => {
  return await fetchService(
    `/agents/issues/${issueId}/priority`,
    {
      method: "PUT",
      body: {
        priority,
      },
    }
  );
};

export const fetchAgentDashboard = async () => {
  return await fetchService("/dashboard");
};

export const fetchAgents = async () => {
  return await fetchService("/agents");
};