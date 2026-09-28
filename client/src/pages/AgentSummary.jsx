import { useContext, useEffect, useState } from "react";
import {
  LuClipboardList,
  LuCircleCheck,
  LuInbox,
  LuUserCheck,
  LuUsers,
} from "react-icons/lu";

import DashboardContext from "../context/DashboardContext.jsx";

const AgentSummary = () => {
  const {
    loadDashboard,
    loadAgents,
  } = useContext(DashboardContext);

  const [agents, setAgents] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadAgentSummaryData = async () => {
      try {
        const [agentsData, dashboardData] =
          await Promise.all([
            loadAgents(),
            loadDashboard(),
          ]);

        setAgents(agentsData || []);
        setDashboardData(dashboardData);
      } catch (error) {
        console.error(
          "Failed to load agent summary:",
          error
        );
      }
    };

    loadAgentSummaryData();
  }, [loadAgents, loadDashboard]);

  const issuesByAgent =
    dashboardData?.issuesByAgent || [];

  const totalAgents =
    Number(dashboardData?.users?.totalAgents) || 0;

  const availableAgents = agents.filter((agent) => {
    const agentData = issuesByAgent.find(
      (item) =>
        Number(item.agentId) === Number(agent.id)
    );

    return Number(agentData?.issueCount || 0) === 0;
  });

  const assignedIssues =
    Number(
      dashboardData?.assignment?.assignedIssues
    ) || 0;

  const unassignedIssues =
    Number(
      dashboardData?.assignment?.unassignedIssues
    ) || 0;

  const getAssignedIssueCount = (agentId) => {
    const agentData = issuesByAgent.find(
      (item) =>
        Number(item.agentId) === Number(agentId)
    );

    return Number(agentData?.issueCount || 0);
  };

  const statCards = [
    {
      label: "Total Agents",
      value: totalAgents,
      icon: LuUsers,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      label: "Available Agents",
      value: availableAgents.length,
      icon: LuUserCheck,
      iconClass: "bg-green-500/15 text-green-500",
    },
    {
      label: "Assigned Issues",
      value: assignedIssues,
      icon: LuClipboardList,
      iconClass: "bg-yellow-500/15 text-yellow-500",
    },
    {
      label: "Unassigned Issues",
      value: unassignedIssues,
      icon: LuInbox,
      iconClass: "bg-blue-500/15 text-blue-500",
    },
  ];

  return (
    <main className="p-6">
      <div className="space-y-8">

        {/* Page Header */}
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LuUsers
              size={23}
              strokeWidth={1.8}
            />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-text">
              Agent Summary
            </h1>

            <p className="mt-1 text-sm text-text-muted">
              Overview of agents and their current issue workload.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:bg-background"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-text-muted">
                      {card.label}
                    </p>

                    <p className="mt-3 text-3xl font-semibold text-text">
                      {card.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.8}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Agent Overview */}
        <section className="rounded-2xl border border-border bg-surface">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-text">
              Agent Overview
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Current workload and availability of all agents.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-5 py-3 text-left text-sm font-medium text-text-muted">
                    ID
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-medium text-text-muted">
                    Name
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-medium text-text-muted">
                    Email
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-medium text-text-muted">
                    Role
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-medium text-text-muted">
                    Active Issues
                  </th>

                  <th className="px-5 py-3 text-left text-sm font-medium text-text-muted">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {agents.map((agent) => {
                  const assignedIssueCount =
                    getAssignedIssueCount(agent.id);

                  const isAvailable =
                    assignedIssueCount === 0;

                  return (
                    <tr
                      key={agent.id}
                      className="border-b border-border last:border-b-0 hover:bg-background"
                    >
                      <td className="px-5 py-4 text-sm text-text">
                        {agent.id}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-text">
                        {agent.name}
                      </td>

                      <td className="px-5 py-4 text-sm text-text-muted">
                        {agent.email}
                      </td>

                      <td className="px-5 py-4 text-sm text-text">
                        {agent.role}
                      </td>

                      <td className="px-5 py-4 text-sm text-text">
                        {assignedIssueCount}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            isAvailable
                              ? "bg-green-500/15 text-green-600"
                              : "bg-yellow-500/15 text-yellow-600"
                          }`}
                        >
                          {isAvailable ? (
                            <LuCircleCheck size={14} />
                          ) : (
                            <LuClipboardList size={14} />
                          )}

                          {isAvailable
                            ? "Available"
                            : "Working"}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {agents.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-10 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <LuInbox
                          size={30}
                          className="text-text-muted"
                        />

                        <p className="text-sm text-text-muted">
                          No agents available.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AgentSummary;