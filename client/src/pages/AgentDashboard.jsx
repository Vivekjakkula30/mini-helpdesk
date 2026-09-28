import {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  LuCircleCheck,
  LuClipboardList,
  LuClock3,
  LuLayoutDashboard,
  LuTicket,
} from "react-icons/lu";

import {
  fetchAssignedIssues,
  fetchAgentDashboard,
} from "../features/agent/dashboard/agentDashboard.service.js";

import MyAssignedIssues from "../features/agent/dashboard/components/MyAssignedIssues.jsx";

import CategoriesContext from "../context/CategoriesContext.jsx";


const AgentDashboard = () => {

  const [assignedIssues, setAssignedIssues] =
    useState([]);

  const [dashboardStats, setDashboardStats] =
    useState({
      totalIssues: 0,
      openIssues: 0,
      inProgressIssues: 0,
      resolvedIssues: 0,
      closedIssues: 0,
    });

  const [statsLoading, setStatsLoading] =
    useState(true);


  const {
    loadCategories,
  } = useContext(CategoriesContext);


  useEffect(() => {

    const loadAssignedIssues = async () => {

      try {

        const data =
          await fetchAssignedIssues(1, 10);

        setAssignedIssues(
          data?.issues || []
        );

      } catch (error) {

        console.error(
          "Failed to load assigned issues:",
          error
        );

        setAssignedIssues([]);

      }

    };

    loadAssignedIssues();

  }, []);


  useEffect(() => {

    const loadDashboardStats = async () => {

      try {

        setStatsLoading(true);

        const data =
          await fetchAgentDashboard();

        setDashboardStats({

          totalIssues:
            Number(data?.totalIssues) || 0,

          openIssues:
            Number(
              data?.status?.openIssues
            ) || 0,

          inProgressIssues:
            Number(
              data?.status?.inProgressIssues
            ) || 0,

          resolvedIssues:
            Number(
              data?.status?.resolvedIssues
            ) || 0,

          closedIssues:
            Number(
              data?.status?.closedIssues
            ) || 0,

        });

      } catch (error) {

        console.error(
          "Failed to load agent dashboard stats:",
          error
        );

      } finally {

        setStatsLoading(false);

      }

    };

    loadDashboardStats();

  }, []);


  // Load categories for My Assigned Issues
  useEffect(() => {

    const loadCategoryData = async () => {

      try {

        await loadCategories();

      } catch (error) {

        console.error(
          "Failed to load categories:",
          error
        );

      }

    };

    loadCategoryData();

  }, [loadCategories]);


  const stats = [
    {
      title: "Total Issues",
      value: dashboardStats.totalIssues,
      icon: LuClipboardList,
      iconClass:
        "bg-primary/10 text-primary",
    },
    {
      title: "Open",
      value: dashboardStats.openIssues,
      icon: LuTicket,
      iconClass:
        "bg-blue-500/10 text-blue-500",
    },
    {
      title: "In Progress",
      value:
        dashboardStats.inProgressIssues,
      icon: LuClock3,
      iconClass:
        "bg-yellow-500/10 text-yellow-500",
    },
    {
      title: "Resolved",
      value:
        dashboardStats.resolvedIssues,
      icon: LuCircleCheck,
      iconClass:
        "bg-green-500/10 text-green-500",
    },
    {
      title: "Closed",
      value:
        dashboardStats.closedIssues,
      icon: LuCircleCheck,
      iconClass:
        "bg-gray-500/10 text-text-muted",
    },
  ];


  return (
    <main className="p-4 sm:p-6">

      <div className="space-y-8">

        {/* Page Header */}

        <div className="flex items-start gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

            <LuLayoutDashboard
              size={23}
              strokeWidth={1.8}
            />

          </div>


          <div>

            <h1 className="text-2xl font-semibold text-text">
              Agent Dashboard
            </h1>

            <p className="mt-1 text-sm text-text-muted">
              Monitor your assigned issues and track your current workload.
            </p>

          </div>

        </div>


        {/* KPI Cards */}

        <section>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {stats.map((stat) => {

              const Icon = stat.icon;

              return (

                <div
                  key={stat.title}
                  className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="text-sm font-medium text-text-muted">
                        {stat.title}
                      </p>

                      <div className="mt-3">

                        {statsLoading ? (

                          <div className="h-9 w-12 animate-pulse rounded-lg bg-background" />

                        ) : (

                          <p className="text-3xl font-semibold tracking-tight text-text">
                            {stat.value}
                          </p>

                        )}

                      </div>

                    </div>


                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}
                    >

                      <Icon
                        size={21}
                        strokeWidth={1.8}
                      />

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        </section>


        {/* Assigned Issues */}

        <MyAssignedIssues
          issues={assignedIssues}
        />

      </div>

    </main>
  );
};


export default AgentDashboard;