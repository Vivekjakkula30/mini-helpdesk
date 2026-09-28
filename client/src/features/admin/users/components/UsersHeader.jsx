import { useNavigate } from "react-router-dom";
import { LuUserRound, LuUserPlus } from "react-icons/lu";

import Button from "../../../../components/ui/Button.jsx";

const UsersHeader = () => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LuUserRound size={21} strokeWidth={1.9} />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Users
          </h1>

          <p className="mt-1 text-sm text-text-muted">
            Manage system users and their access.
          </p>
        </div>
      </div>

      <Button
        onClick={() => navigate("/admin/users/add")}
        className="inline-flex items-center gap-2"
      >
        <LuUserPlus size={17} strokeWidth={1.9} />
        Add User
      </Button>
    </section>
  );
};

export default UsersHeader;