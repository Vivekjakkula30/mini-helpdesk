import { NavLink } from "react-router-dom";
import { useContext } from "react";

import AuthContext from "../context/AuthContext.jsx";

import {
  LuCheck,
  LuLayoutDashboard,
  LuTags,
  LuTicket,
  LuUserCog,
  LuUsers,
  LuX,
} from "react-icons/lu";

const Sidebar = ({
  sidebarOpen,
  onClose,
}) => {
  

  const { user } = useContext(AuthContext);

  const navItemsByRole = {
    ADMIN: [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: LuLayoutDashboard,
      },
      {
        label: "Issues",
        path: "/admin/issues",
        icon: LuTicket,
      },
      {
        label: "Users",
        path: "/admin/users",
        icon: LuUsers,
      },
      {
        label: "Agents",
        path: "/admin/agents",
        icon: LuUserCog,
      },
      {
        label: "Categories",
        path: "/admin/categories",
        icon: LuTags,
      },
    ],

    AGENT: [
      {
        label: "Dashboard",
        path: "/agent/dashboard",
        icon: LuLayoutDashboard,
      },
      {
        label: "Issues",
        path: "/agent/issues",
        icon: LuTicket,
      },
    ],

    REPORTER: [
      {
        label: "Dashboard",
        path: "/reporter/dashboard",
        icon: LuLayoutDashboard,
      },
      {
        label: "Create Issue",
        path: "/reporter/issues/create",
        icon: LuTicket,
      },
    ],
  };

  const navItems = navItemsByRole[user?.role] || [];

  const handleNavigation = () => {
    onClose?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 shrink-0 flex-col
          border-r border-border bg-surface
          transition-transform duration-300 ease-in-out
          md:static md:z-auto md:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Brand Section */}
        <div className="flex h-20 items-center justify-between border-b border-border px-5">

          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-sm">
              <LuCheck
                size={24}
                className="text-white"
                strokeWidth={2.5}
              />

              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-surface bg-surface">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-text">
                IssueTracker
              </h2>

              <p className="mt-0.5 text-[11px] text-text-muted">
                Helpdesk workspace
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-background hover:text-text md:hidden"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
            Workspace
          </p>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavigation}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-text-muted hover:bg-background hover:text-text"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-white" />
                      )}

                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "bg-white/15 text-white"
                            : "bg-background text-text-muted group-hover:bg-surface group-hover:text-primary"
                        }`}
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.9}
                        />
                      </span>

                      <span className="truncate tracking-tight">
                        {item.label}
                      </span>

                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;