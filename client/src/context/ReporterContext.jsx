import {
  createContext,
  useState,
  useCallback,
} from "react";

import {
  fetchReporterIssues,
  createIssue as createReporterIssue,
} from "../features/reporter/reporter.service.js";

const ReporterContext = createContext();

const ReporterProvider = ({ children }) => {
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const loadMyIssues = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchReporterIssues(page, 10);

      const sortedIssues = [...(data.issues || [])].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setMyIssues(sortedIssues);
      setPagination({
        totalItems: data.totalItems,
        totalPages: data.totalPages,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  
  const totalIssues = myIssues.length;

  const openIssues = myIssues.filter(
    (issue) => issue.status === "OPEN"
  ).length;

  const inProgressIssues = myIssues.filter(
    (issue) => issue.status === "IN_PROGRESS"
  ).length;

  const resolvedIssues = myIssues.filter(
    (issue) => issue.status === "RESOLVED"
  ).length;

  const closedIssues = myIssues.filter(
    (issue) => issue.status === "CLOSED"
  ).length;

  const addIssue = async (issueData) => {
    const newIssue = await createReporterIssue(issueData);

    setMyIssues((currentIssues) => [
      ...currentIssues,
      newIssue,
    ]);

    return newIssue;
  };

  return (
    <ReporterContext.Provider
      value={{
        myIssues,
        loading,
        error,
        totalIssues,
        openIssues,
        inProgressIssues,
        resolvedIssues,
        closedIssues,
        addIssue,
        loadMyIssues,
        pagination,
      }}
    >
      {children}
    </ReporterContext.Provider>
  );
};

export { ReporterProvider };
export default ReporterContext;