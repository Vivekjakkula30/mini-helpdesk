import fetchService from "../../../services/fetchService.js";

export const fetchRecentIssues = async () => {
  return await fetchService("/issues?page=1&limit=10");
};

export const fetchReopenedIssues = async () => {
  return await fetchService("/issues/reopened");
};

export const fetchDashboard = async () => {
  return await fetchService("/dashboard");
};