import { LuTriangleAlert, LuTrash2, LuX } from "react-icons/lu";

const DeleteConfirmDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
            <LuTriangleAlert size={21} strokeWidth={1.9} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-text">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-text-muted">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            title="Close"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-background hover:text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <LuX size={18} strokeWidth={1.9} />
          </button>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-danger/30"
          >
            <LuTrash2 size={17} strokeWidth={1.9} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;