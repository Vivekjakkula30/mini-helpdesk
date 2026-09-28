import {
  LuCircleCheck,
  LuCircleDot,
  LuClipboardList,
  LuClock3,
  LuListChecks,
} from "react-icons/lu";

const AgentStatsSection = ({ stats }) => {
  const statCards = [
    {
      label: "Total Issues",
      value: stats.totalIssues,
      icon: LuClipboardList,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      label: "Open Issues",
      value: stats.openIssues,
      icon: LuCircleDot,
      iconClass: "bg-blue-500/15 text-blue-500",
    },
    {
      label: "In Progress",
      value: stats.inProgressIssues,
      icon: LuClock3,
      iconClass: "bg-yellow-500/15 text-yellow-500",
    },
    {
      label: "Resolved",
      value: stats.resolvedIssues,
      icon: LuCircleCheck,
      iconClass: "bg-green-500/15 text-green-500",
    },
    {
      label: "Closed",
      value: stats.closedIssues,
      icon: LuListChecks,
      iconClass: "bg-gray-500/15 text-text-muted",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
                <Icon size={22} strokeWidth={1.8} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default AgentStatsSection;