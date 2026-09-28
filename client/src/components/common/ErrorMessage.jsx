const ErrorMessage = ({ message }) => {
  return (
    <p className="text-sm text-danger">
      {message}
    </p>
  );
};

export default ErrorMessage;