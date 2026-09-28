const DeleteUserDialog = ({ user, onCancel, onConfirm }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m0 3.75h.007v.008H12v-.008ZM10.343 3.94 2.93 16.5A1.875 1.875 0 0 0 4.54 19.31h14.92a1.875 1.875 0 0 0 1.61-2.81L13.657 3.94a1.875 1.875 0 0 0-3.314 0Z"
              />
            </svg>
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-text">
              Delete User
            </h2>

            <p className="mt-2 text-sm leading-6 text-text-muted">
              Are you sure you want to delete{" "}
              <span className="font-medium text-text">
                {user.name}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-muted transition-colors duration-200 hover:bg-background hover:text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-danger px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-danger/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-danger/30"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserDialog;