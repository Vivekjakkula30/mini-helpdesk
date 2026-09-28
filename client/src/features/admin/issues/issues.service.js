import fetchService from "../../../services/fetchService.js";

export const fetchIssues = async (
  page = 1,
  limit = 10,
  status = "",
  priority = "",
  categoryId = ""
) => {
  const params = new URLSearchParams();

  // URLSearchParams ka kaam sirf filters/pagination ko URL query parameters mein convert karna hai.
  params.append("page", page);
  params.append("limit", limit);

  if (status) {
    params.append("status", status);
  }

  if (priority) {
    params.append("priority", priority);
  }

  if (categoryId) {
    params.append("categoryId", categoryId);
  }

  return await fetchService(`/issues?${params.toString()}`);
};

export const fetchIssueById = async (id) => {
  return await fetchService(`/issues/${id}`);
};

export const editIssue = async (id, updatedData) => {
  return await fetchService(`/issues/${id}`, {
    method: "PUT",
    body: updatedData,
  });
};

export const assignIssue = async (id, assignedId) => {
  return await fetchService(`/issues/${id}/assignAgent`, {
    method: "PUT",
    body: {
      assignedId,
    },
  });
};

export const updateIssuePriority = async (id, priority) => {
  return await fetchService(`/issues/${id}/priority`, {
    method: "PUT",
    body: {
      priority,
    },
  });
};

export const deleteIssue = async (id) => {
  return await fetchService(`/issues/${id}`, {
    method: "DELETE",
  });
};

export const fetchAgents = async () => {
  return await fetchService("/agents");
};