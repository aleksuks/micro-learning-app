import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const STORAGE_KEY = "@theme_mode";

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  subtext: string;
  accent: string;
  accentText: string;
  border: string;
  red: string;
  tabBar: string;
  tabBarBorder: string;
  tabActive: string;
  tabInactive: string;
  switchTrackOff: string;
}

const DARK: ThemeColors = {
  bg: "#000",
  surface: "#1a1a1a",
  surfaceAlt: "#111",
  text: "#fff",
  subtext: "#999",
  accent: "#c084fc",
  accentText: "#000",
  border: "#222",
  red: "#ef4444",
  tabBar: "#000",
  tabBarBorder: "#222",
  tabActive: "#fff",
  tabInactive: "#999",
  switchTrackOff: "#444",
};

const LIGHT: ThemeColors = {
  bg: "#f2f2f7",
  surface: "#fff",
  surfaceAlt: "#f9f9f9",
  text: "#111",
  subtext: "#666",
  accent: "#9333ea",
  accentText: "#fff",
  border: "#e5e5ea",
  red: "#dc2626",
  tabBar: "#fff",
  tabBarBorder: "#e5e5ea",
  tabActive: "#111",
  tabInactive: "#999",
  switchTrackOff: "#ccc",
};

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  colors: DARK,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val !== null) setIsDark(val === "dark");
      setLoaded(true);
    });
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    AsyncStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  }

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ isDark, colors: isDark ? DARK : LIGHT, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
