import DashboardHeader from "../features/reporter/components/DashboardHeader.jsx";
import StatsSection from "../features/reporter/components/ReporterStatsSection.jsx";
import MyIssuesSection from "../features/reporter/components/MyIssuesSection.jsx";

import ReporterContext from "../context/ReporterContext.jsx";
import CategoriesContext from "../context/CategoriesContext.jsx";

import { useContext, useEffect } from "react";


const ReporterDashboard = () => {

  const {
    loadMyIssues
  } = useContext(ReporterContext);

  const {
    loadCategories
  } = useContext(CategoriesContext);


  useEffect(() => {

    const loadDashboardData = async () => {

      try {

        await Promise.all([
          loadMyIssues(),
          loadCategories(),
        ]);

      } catch (error) {

        console.error(
          "Failed to load reporter dashboard:",
          error
        );

      }

    };

    loadDashboardData();

  }, [
    loadMyIssues,
    loadCategories,
  ]);


  return (
    <main className="p-4 sm:p-6">

      <div className="space-y-8">

        <DashboardHeader />

        <StatsSection />

        <MyIssuesSection />

      </div>

    </main>
  );
};


export default ReporterDashboard;