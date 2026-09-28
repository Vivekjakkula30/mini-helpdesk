import { useMemo, useState } from "react";

import Input from "../../../../components/ui/Input.jsx";
import Select from "../../../../components/ui/Select.jsx";
import EmptyState from "../../../../components/common/EmptyState.jsx";
import UsersTable from "./UsersTable.jsx";
import useDebounce from "../../../../hooks/useDebounce.js";

const UsersListSection = ({ users = [], onDelete }) => {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const debouncedSearch = useDebounce(search);

  const roleOptions = [
    { value: "", label: "All Roles" },
    { value: "ADMIN", label: "Admin" },
    { value: "AGENT", label: "Agent" },
    { value: "REPORTER", label: "Reporter" },
  ];

  const filteredUsers = useMemo(() => {
    const searchValue = debouncedSearch.trim().toLowerCase();

    return users.filter((user) => {
      const userName = user.name?.toLowerCase() || "";
      const userEmail = user.email?.toLowerCase() || "";

      const matchesSearch =
        userName.includes(searchValue) ||
        userEmail.includes(searchValue);

      const matchesRole = role === "" || user.role === role;

      return matchesSearch && matchesRole;
    });
  }, [users, debouncedSearch, role]);

  return (
    <section className="space-y-5">
      <div className="rounded-card border border-border bg-surface p-4">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-text">
            All Users
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Search users or filter them by role.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email"
          />

          <Select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            options={roleOptions}
          />
        </div>
      </div>

      <div>
        {filteredUsers.length === 0 ? (
          <EmptyState message="No users found." />
        ) : (
          <UsersTable
            users={filteredUsers}
            onDelete={onDelete}
          />
        )}
      </div>
    </section>
  );
};

export default UsersListSection;