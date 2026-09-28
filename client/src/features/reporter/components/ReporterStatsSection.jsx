import { useContext } from "react";
import {
  LuClipboardList,
  LuCircleCheck,
  LuCircleDot,
  LuClock3,
  LuLock,
} from "react-icons/lu";

import ReporterContext from "../../../context/ReporterContext.jsx";

const StatsSection = () => {
  const {
    totalIssues,
    openIssues,
    inProgressIssues,
    resolvedIssues,
    closedIssues,
  } = useContext(ReporterContext);

  const stats = [
    {
      label: "Total Issues",
      value: totalIssues,
      icon: LuClipboardList,
      iconWrapper: "bg-primary/10 text-primary",
    },
    {
      label: "Open",
      value: openIssues,
      icon: LuCircleDot,
      iconWrapper: "bg-primary/10 text-primary",
    },
    {
      label: "In Progress",
      value: inProgressIssues,
      icon: LuClock3,
      iconWrapper: "bg-warning/10 text-warning",
    },
    {
      label: "Resolved",
      value: resolvedIssues,
      icon: LuCircleCheck,
      iconWrapper: "bg-success/10 text-success",
    },
    {
      label: "Closed",
      value: closedIssues,
      icon: LuLock,
      iconWrapper: "bg-surface-secondary text-text-muted",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition-colors hover:border-primary/30"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-base font-medium text-text-muted">
                {stat.label}
              </p>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconWrapper}`}
              >
                <Icon size={22} strokeWidth={1.9} />
              </div>
            </div>

            <p className="mt-4 text-3xl font-bold leading-none text-text">
              {stat.value}
            </p>
          </div>
        );
      })}
    </section>
  );
};

export default StatsSection;