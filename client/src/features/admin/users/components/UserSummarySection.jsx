import {
  LuShieldCheck,
  LuUsers,
  LuUserRound,
  LuUserCheck,
} from "react-icons/lu";

const UserSummarySection = ({ userSummary }) => {
  const summaryCards = [
    {
      label: "Total Users",
      value: userSummary.totalUsers,
      icon: LuUsers,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      label: "Admins",
      value: userSummary.admins,
      icon: LuShieldCheck,
      iconClass: "bg-violet-500/10 text-violet-500",
    },
    {
      label: "Agents",
      value: userSummary.agents,
      icon: LuUserCheck,
      iconClass: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Reporters",
      value: userSummary.reporters,
      icon: LuUserRound,
      iconClass: "bg-emerald-500/10 text-emerald-500",
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-card border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-text-muted">
                    {card.label}
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-tight text-text">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}
                >
                  <Icon size={20} strokeWidth={1.9} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default UserSummarySection;