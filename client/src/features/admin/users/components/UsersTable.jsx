import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LuEye, LuPencil, LuTrash2 } from "react-icons/lu";

const UsersTable = ({ users, onDelete }) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 10;

  const totalPages = Math.ceil(users.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;

  const currentUsers = users.slice(
    startIndex,
    startIndex + usersPerPage
  );

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border bg-background/50">
            <tr>
              <th className="px-5 py-4 font-medium text-text-muted">
                ID
              </th>

              <th className="px-5 py-4 font-medium text-text-muted">
                Name
              </th>

              <th className="px-5 py-4 font-medium text-text-muted">
                Email
              </th>

              <th className="px-5 py-4 font-medium text-text-muted">
                Role
              </th>

              <th className="px-5 py-4 font-medium text-text-muted">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border transition-colors duration-200 last:border-b-0 hover:bg-background/40"
              >
                <td className="px-5 py-4 font-medium text-text">
                  {user.id}
                </td>

                <td className="px-5 py-4 font-medium text-text">
                  {user.name}
                </td>

                <td className="px-5 py-4 text-text-muted">
                  {user.email}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-violet-500/10 text-violet-500"
                        : user.role === "AGENT"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-emerald-500/10 text-emerald-500"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {/* View */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/admin/users/${user.id}`)
                      }
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-colors duration-200 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      title="View"
                      aria-label={`View ${user.name}`}
                    >
                      <LuEye size={18} strokeWidth={1.8} />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/admin/users/${user.id}/edit`)
                      }
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-colors duration-200 hover:bg-blue-500/10 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      title="Edit"
                      aria-label={`Edit ${user.name}`}
                    >
                      <LuPencil size={18} strokeWidth={1.8} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => onDelete(user)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-colors duration-200 hover:bg-danger/10 hover:text-danger focus:outline-none focus:ring-2 focus:ring-danger/30"
                      title="Delete"
                      aria-label={`Delete ${user.name}`}
                    >
                      <LuTrash2 size={18} strokeWidth={1.8} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => page - 1)
              }
              disabled={currentPage === 1}
              className="rounded-button border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`min-h-9 min-w-9 rounded-button px-3 text-sm font-medium transition-colors duration-200 ${
                    currentPage === page
                      ? "bg-primary text-white"
                      : "text-text-muted hover:bg-background hover:text-primary"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => page + 1)
              }
              disabled={currentPage === totalPages}
              className="rounded-button border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;