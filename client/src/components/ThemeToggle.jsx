import { LuMoon, LuSun } from "react-icons/lu";
import useTheme from "../hooks/useTheme.js";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const isLightTheme = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={
        isLightTheme
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
      aria-label={
        isLightTheme
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-text-muted transition-all duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      {isLightTheme ? (
        <LuMoon size={19} strokeWidth={1.8} />
      ) : (
        <LuSun size={19} strokeWidth={1.8} />
      )}
    </button>
  );
};

export default ThemeToggle;