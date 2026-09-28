import {
  createContext,
  useState,
  useCallback,
} from "react";

import { fetchIssues } from "../features/admin/issues/issues.service.js";

const IssuesContext = createContext();

const IssuesProvider = ({ children }) => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [issues, setIssues] = useState([]);
  const [pagination, setPagination] = useState(null);

  const loadIssues = useCallback(
    async (
      pageNumber = page,
      statusValue = status,
      priorityValue = priority,
      categoryValue = categoryId
    ) => {
      const data = await fetchIssues(
        pageNumber,
        limit,
        statusValue,
        priorityValue,
        categoryValue
      );

      setIssues(data.issues);
      setPagination(data.pagination);

      return data;
    },
    [
      page,
      limit,
      status,
      priority,
      categoryId,
    ]
  );

  return (
    <IssuesContext.Provider
      value={{
        issues,
        pagination,
        page,
        setPage,
        status,
        setStatus,
        priority,
        setPriority,
        categoryId,
        setCategoryId,
        loadIssues,
      }}
    >
      {children}
    </IssuesContext.Provider>
  );
};

export { IssuesProvider };
export default IssuesContext;