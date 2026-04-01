import { createContext, useContext, useState, useEffect } from "react";
import { themes } from "../theme/studentTheme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeScope, setThemeScope] = useState("student");

  const [studentThemeName, setStudentThemeName] = useState(
    localStorage.getItem("theme_student") || "dark"
  );
  const [adminThemeName, setAdminThemeName] = useState(
    localStorage.getItem("theme_admin") || "dark"
  );

  const themeName = themeScope === "admin" ? adminThemeName : studentThemeName;

  useEffect(() => {
    localStorage.setItem("theme_student", studentThemeName);
  }, [studentThemeName]);

  useEffect(() => {
    localStorage.setItem("theme_admin", adminThemeName);
  }, [adminThemeName]);

  useEffect(() => {
    const root = document.documentElement;
    if (themeName === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [themeName]);

  const toggleTheme = () => {
    if (themeScope === "admin") {
      setAdminThemeName((prev) => (prev === "dark" ? "light" : "dark"));
      return;
    }
    setStudentThemeName((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider
      value={{
        themeScope,
        setThemeScope,
        themeName,
        theme: themes[themeName],
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}