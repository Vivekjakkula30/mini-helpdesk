const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;