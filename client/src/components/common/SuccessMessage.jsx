import { useEffect } from "react";

const SuccessMessage = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="bg-surface border border-success rounded-card px-4 py-3">
      <p className="text-sm text-success">{message}</p>
    </div>
  );
};

export default SuccessMessage;