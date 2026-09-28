import fetchService from "../../services/fetchService.js";

export const fetchReporterDashboard = async () => {
  return await fetchService("/dashboard");
};

export const fetchReporterIssues = async (page = 1, limit = 10) => {
  return await fetchService(
    `/reporter/issues?page=${page}&limit=${limit}`
  );
};


export const fetchReporterIssueById = async (issueId) => {
  return await fetchService(`/reporter/issues/${issueId}`);
};


export const createIssue = async (issueData) => {
  return await fetchService("/reporter/issues", {
    method: "POST",
    body: issueData,
  });
};

export const reopenIssue = async (issueId, reopenReason) =>
  fetchService(`/reporter/issues/${issueId}/reopen`, {
    method: "PUT",
    body: {
      reopenReason,
    },
  });