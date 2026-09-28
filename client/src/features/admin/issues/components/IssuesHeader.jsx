import { LuClipboardList } from "react-icons/lu";

const IssuesHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LuClipboardList size={21} strokeWidth={1.9} />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Issues
          </h1>

          <p className="mt-1 text-sm text-text-muted">
            Manage system issues.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IssuesHeader;