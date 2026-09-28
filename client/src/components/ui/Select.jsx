import { useEffect, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const Select = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectRef = useRef(null);

  const selectedOption =
    options.find(
      (option) => option.value === value
    ) || options[0];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target)
      ) {
        setIsOpen(false);
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

  const handleOptionClick = (option) => {
    onChange({
      target: {
        value: option.value,
      },
    });

    setIsOpen(false);
  };

  return (
    <div
      ref={selectRef}
      className="relative w-full"
    >
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between rounded-input border border-border bg-surface px-4 py-2 text-left text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {selectedOption?.label || "Select"}
        </span>

        <LuChevronDown
          size={18}
          className={`shrink-0 text-text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-input border border-border bg-surface py-1 shadow-lg"
          role="listbox"
        >
          {options.map((option) => {
            const isSelected =
              option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  handleOptionClick(option)
                }
                className={`block w-full cursor-pointer px-4 py-2.5 text-left text-sm transition-colors ${
                  isSelected
                    ? "bg-primary/10 text-primary"
                    : "text-text hover:bg-background"
                }`}
                role="option"
                aria-selected={isSelected}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;