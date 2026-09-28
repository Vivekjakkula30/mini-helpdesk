const EmptyState = ({ message = "No data found." }) => {
  return (
    <p className="text-sm text-text-muted">
      {message}
    </p>
  );
};

export default EmptyState;