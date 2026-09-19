import {  useEffect, type ReactNode } from "react";
import { useAppSelector } from "../../Hooks/ReduxHooks";

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  return children;
};

export default ThemeProvider;
