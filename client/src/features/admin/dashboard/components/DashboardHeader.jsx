import { LuLayoutDashboard } from "react-icons/lu";

const DashboardHeader = () => {
  return (
    <section>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LuLayoutDashboard size={21} strokeWidth={1.9} />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-text-muted">
            Overview of your issue tracker and current activity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DashboardHeader;