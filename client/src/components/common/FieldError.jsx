const FieldError = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <p className="text-sm text-danger mt-1">
      {message}
    </p>
  );
};

export default FieldError;