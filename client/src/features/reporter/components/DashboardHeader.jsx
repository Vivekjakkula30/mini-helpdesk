import { LuClipboardList } from "react-icons/lu";

const DashboardHeader = () => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <LuClipboardList size={22} strokeWidth={1.9} />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-text">
          Reporter Dashboard
        </h1>

        <p className="mt-1 text-sm text-text-muted">
          Track and manage your reported issues.
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;