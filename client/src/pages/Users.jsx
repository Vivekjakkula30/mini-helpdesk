import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { fetchUserSummary } from "../features/admin/users/users.service.js";

import UsersHeader from "../features/admin/users/components/UsersHeader.jsx";
import UsersListSection from "../features/admin/users/components/UsersListSection.jsx";
import UserSummarySection from "../features/admin/users/components/UserSummarySection.jsx";
import DeleteUserDialog from "../features/admin/users/components/DeleteUserDialog.jsx";

import Loading from "../components/common/Loading.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import SuccessMessage from "../components/common/SuccessMessage.jsx";

import UsersContext from "../context/UsersContext.jsx";

const Users = () => {
  const {
    users,
    loading: usersLoading,
    error: usersError,
    loadUsers,
    pagination,
    handleRemoveUser,
  } = useContext(UsersContext);

  const [userSummary, setUserSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const success = location.state?.success;

  // Fetch user summary
  useEffect(() => {
    const loadUserSummary = async () => {
      try {
        setSummaryLoading(true);
        setSummaryError("");

        const userSummaryData = await fetchUserSummary();

        setUserSummary(userSummaryData);
      } catch (error) {
        console.error("Failed to fetch user summary:", error);

        setSummaryError(
          error?.message ||
            "Failed to fetch user summary. Please try again."
        );
      } finally {
        setSummaryLoading(false);
      }
    };

    loadUserSummary();
    loadUsers(1);
  }, []);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteError("");
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    if (deleteLoading) return;

    setIsDialogOpen(false);
    setSelectedUser(null);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      setDeleteLoading(true);
      setDeleteError("");

      // Delete the selected user
      await handleRemoveUser(selectedUser.id);

      // Refresh the summary after successful deletion
      const updatedSummary = await fetchUserSummary();
      setUserSummary(updatedSummary);

      // Close the dialog automatically after successful deletion
      setIsDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Delete failed:", error);

      setDeleteError(
        error?.message || "Failed to delete user. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSuccessClose = () => {
    navigate("/admin/users", {
      replace: true,
      state: {},
    });
  };

  return (
    <main className="space-y-8 p-4 sm:p-6">
      <UsersHeader />

      {success && (
        <SuccessMessage
          message={success}
          onClose={handleSuccessClose}
        />
      )}

      {usersLoading && <Loading />}

      {usersError && <ErrorMessage message={usersError} />}

      {summaryLoading && <Loading />}

      {summaryError && <ErrorMessage message={summaryError} />}

      {userSummary && (
        <UserSummarySection userSummary={userSummary} />
      )}

      <UsersListSection
        users={users}
        onDelete={handleDeleteClick}
      />

      {pagination.total > 0 && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={() => loadUsers(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-muted transition-colors duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-transparent disabled:hover:text-text-muted"
          >
            Previous
          </button>

          {Array.from(
            { length: pagination.totalPages },
            (_, index) => index + 1
          ).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => loadUsers(page)}
              className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                pagination.page === page
                  ? "border-primary bg-primary text-white"
                  : "border-border text-text-muted hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => loadUsers(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-muted transition-colors duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-transparent disabled:hover:text-text-muted"
          >
            Next
          </button>
        </div>
      )}

      {isDialogOpen && selectedUser && (
        <DeleteUserDialog
          user={selectedUser}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDialogClose}
          loading={deleteLoading}
          error={deleteError}
        />
      )}
    </main>
  );
};

export default Users;