import {
  useContext,
  useEffect,
  useState,
} from "react";

import DashboardContext from "../context/DashboardContext.jsx";
import CategoriesContext from "../context/CategoriesContext.jsx";

import DashboardHeader from "../features/admin/dashboard/components/DashboardHeader.jsx";
import StatsSection from "../features/admin/dashboard/components/StatsSection.jsx";
import RecentIssuesSection from "../features/admin/dashboard/components/RecentIssuesSection.jsx";


const AdminDashboard = () => {

  const {
    loadDashboard,
    loadRecentIssues,
    loadReopenedIssues,
  } = useContext(DashboardContext);

  const {
    loadCategories,
  } = useContext(CategoriesContext);


  const [totalIssues, setTotalIssues] = useState(0);
  const [issueStatusCounts, setIssueStatusCounts] = useState(null);
  const [issuePriorityCounts, setIssuePriorityCounts] = useState(null);
  const [recentIssues, setRecentIssues] = useState([]);
  const [reopenedIssues, setReopenedIssues] = useState(0);


  useEffect(() => {

    const loadDashboardData = async () => {

      try {

        const [
          dashboardData,
          recentIssuesData,
          reopenedIssuesData,
        ] = await Promise.all([
          loadDashboard(),
          loadRecentIssues(),
          loadReopenedIssues(),
          loadCategories(),
        ]);


        setTotalIssues(
          dashboardData?.issues || 0
        );

        setIssueStatusCounts(
          dashboardData?.status || null
        );

        setIssuePriorityCounts(
          dashboardData?.priority || null
        );

        setRecentIssues(
          recentIssuesData?.issues || []
        );

        setReopenedIssues(
          reopenedIssuesData?.length || 0
        );

      } catch (error) {

        console.error(
          "Failed to load admin dashboard:",
          error
        );

      }

    };

    loadDashboardData();

  }, [
    loadDashboard,
    loadRecentIssues,
    loadReopenedIssues,
    loadCategories,
  ]);


  return (
    <main className="p-4 sm:p-6">

      <div className="space-y-8">

        <DashboardHeader />

        {issueStatusCounts &&
          issuePriorityCounts && (
            <StatsSection
              totalIssues={totalIssues}
              issueStatusCounts={issueStatusCounts}
              issuePriorityCounts={issuePriorityCounts}
              reopenedIssues={reopenedIssues}
            />
          )}

        <RecentIssuesSection
          issues={recentIssues}
        />

      </div>

    </main>
  );
};


export default AdminDashboard;