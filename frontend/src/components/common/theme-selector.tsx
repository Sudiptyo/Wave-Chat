"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-3">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
          theme === "light"
            ? "border-primary bg-primary/10"
            : "border-border hover:bg-muted"
        }`}
      >
        <Sun size={20} />
        <span>Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
          theme === "dark"
            ? "border-primary bg-primary/10"
            : "border-border hover:bg-muted"
        }`}
      >
        <Moon size={20} />
        <span>Dark</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
          theme === "system"
            ? "border-primary bg-primary/10"
            : "border-border hover:bg-muted"
        }`}
      >
        <Monitor size={20} />
        <span>System</span>
      </button>
    </div>
  );
};

export default ThemeSelector;
