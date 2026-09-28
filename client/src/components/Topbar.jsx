import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LuBriefcaseBusiness,
  LuChevronDown,
  LuLogOut,
  LuMenu,
} from "react-icons/lu";

import ThemeToggle from "./ThemeToggle.jsx";
import Modal from "./ui/Modal.jsx";
import AuthContext from "../context/AuthContext.jsx";

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  const [isUserMenuOpen, setIsUserMenuOpen] =
    useState(false);

  const [isLogoutModalOpen, setIsLogoutModalOpen] =
    useState(false);

  const userMenuRef = useRef(null);

  const userName = user?.name || "User";
  const userEmail = user?.email || "—";
  const userRole = user?.role || "—";

  const firstLetter = userName
    .charAt(0)
    .toUpperCase();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleLogoutClick = () => {
    setIsUserMenuOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <>
      <header className="flex min-h-20 items-center justify-between border-b border-border bg-surface px-4 sm:px-6 lg:px-8">

        {/* Left Section */}
        <div className="flex min-w-0 items-center gap-3">

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open sidebar"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-text-muted hover:bg-background hover:text-text md:hidden"
          >
            <LuMenu size={22} />
          </button>

          {/* Welcome Section */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <LuBriefcaseBusiness
                size={18}
                className="shrink-0 text-primary"
                strokeWidth={1.8}
              />

              <p className="truncate text-sm font-semibold text-text sm:text-base">
                Welcome back, {userName}
              </p>
            </div>

            <p className="mt-1 hidden text-sm text-text-muted sm:block">
              Manage your helpdesk workspace
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-5">

          <ThemeToggle />

          <div className="hidden h-8 w-px bg-border sm:block" />

          {/* User Menu */}
          <div
            ref={userMenuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setIsUserMenuOpen(
                  (previous) => !previous
                )
              }
              className="flex cursor-pointer items-center gap-2.5 rounded-xl px-1.5 py-1.5 transition-colors hover:bg-background"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
            >
              {/* Avatar */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                <span className="text-sm font-semibold text-primary">
                  {firstLetter}
                </span>
              </div>

              {/* User Info */}
              <div className="hidden min-w-0 text-left sm:block">
                <p className="max-w-32 truncate text-sm font-semibold leading-tight text-text">
                  {userName}
                </p>

                <p className="mt-1 text-xs uppercase tracking-wide text-text-muted">
                  {userRole}
                </p>
              </div>

              <LuChevronDown
                size={16}
                className={`hidden text-text-muted transition-transform duration-200 sm:block ${
                  isUserMenuOpen
                    ? "rotate-180"
                    : ""
                }`}
                strokeWidth={1.8}
              />
            </button>

            {/* Dropdown */}
            {isUserMenuOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
                role="menu"
              >
                {/* User Details */}
                <div className="border-b border-border p-4">
                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                      <span className="font-semibold text-primary">
                        {firstLetter}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text">
                        {userName}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-text-muted">
                        {userEmail}
                      </p>

                      <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-primary">
                        {userRole}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleLogoutClick}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-background hover:text-primary"
                    role="menuitem"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background">
                      <LuLogOut
                        size={18}
                        strokeWidth={1.9}
                      />
                    </span>

                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() =>
          setIsLogoutModalOpen(false)
        }
        title="Confirm Logout"
      >
        <div className="space-y-5">
          <p className="text-sm leading-6 text-text-muted">
            Are you sure you want to logout from your
            account?
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                setIsLogoutModalOpen(false)
              }
              className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-background hover:text-text"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Topbar;