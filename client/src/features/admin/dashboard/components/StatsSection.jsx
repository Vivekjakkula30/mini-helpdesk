import { useNavigate } from "react-router-dom";
import {
  LuChartNoAxesColumn,
  LuCircleCheck,
  LuCircleDot,
  LuClock3,
  LuFlag,
  LuRotateCcw,
  LuTicket,
} from "react-icons/lu";

const StatsSection = ({
  totalIssues,
  issueStatusCounts,
  issuePriorityCounts,
  reopenedIssues,
}) => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Total Issues",
      value: totalIssues,
      icon: LuTicket,
      iconStyle: "bg-primary/10 text-primary",
    },
    {
      label: "Open",
      value: issueStatusCounts.openIssues,
      icon: LuCircleDot,
      iconStyle: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "In Progress",
      value: issueStatusCounts.inProgressIssues,
      icon: LuClock3,
      iconStyle: "bg-amber-500/10 text-amber-500",
    },
    {
      label: "Resolved",
      value: issueStatusCounts.resolvedIssues,
      icon: LuCircleCheck,
      iconStyle: "bg-emerald-500/10 text-emerald-500",
    },
    {
      label: "Closed",
      value: issueStatusCounts.closedIssues,
      icon: LuChartNoAxesColumn,
      iconStyle: "bg-slate-500/10 text-slate-500",
    },
    {
      label: "High Priority",
      value: issuePriorityCounts.highPriority,
      icon: LuFlag,
      iconStyle: "bg-red-500/10 text-red-500",
    },
    {
      label: "Medium Priority",
      value: issuePriorityCounts.mediumPriority,
      icon: LuFlag,
      iconStyle: "bg-orange-500/10 text-orange-500",
    },
    {
      label: "Low Priority",
      value: issuePriorityCounts.lowPriority,
      icon: LuFlag,
      iconStyle: "bg-green-500/10 text-green-500",
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-card border border-border bg-surface p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-text-muted">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-2xl font-bold tracking-tight text-text">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconStyle}`}
                >
                  <Icon size={20} strokeWidth={1.9} />
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => navigate("/admin/issues?reopened=true")}
          className="group rounded-card border border-border bg-surface p-4 text-left cursor-pointer transition-all duration-200 hover:border-primary/40 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Reopened Issues
              </p>

              <p className="mt-3 text-2xl font-bold tracking-tight text-text">
                {reopenedIssues}
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 transition-colors duration-200 group-hover:bg-violet-500/15">
              <LuRotateCcw size={20} strokeWidth={1.9} />
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};

export default StatsSection;