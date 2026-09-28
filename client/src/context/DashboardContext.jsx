import {
  createContext,
  useCallback,
} from "react";

import {
  fetchDashboard,
  fetchRecentIssues,
  fetchReopenedIssues,
} from "../features/admin/dashboard/adminDashboard.service.js";

import {
  fetchAgents,
} from "../features/agent/dashboard/agentDashboard.service.js";

const DashboardContext = createContext();

const DashboardProvider = ({ children }) => {

  const loadDashboard = useCallback(async () => {
    return await fetchDashboard();
  }, []);

  const loadRecentIssues = useCallback(async () => {
    return await fetchRecentIssues();
  }, []);

  const loadReopenedIssues = useCallback(async () => {
    return await fetchReopenedIssues();
  }, []);

  const loadAgents = useCallback(async () => {
    return await fetchAgents();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        loadDashboard,
        loadRecentIssues,
        loadReopenedIssues,
        loadAgents,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export { DashboardProvider };
export default DashboardContext;