const Input = ({ value, onChange, placeholder, type = "text" }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-border rounded-input bg-surface text-text outline-none focus:ring-2 focus:ring-primary"
    />
  );
};

export default Input;