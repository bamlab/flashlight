import { useCallback, useEffect } from "react";

const themeColors = [
  "bright-yellow",
  "bright-green",
  "bright-magenta",
  "bright-cyan",
] as const;
type ThemeColor = typeof themeColors[number];

export const useSetThemeColor = () => {
  const setThemeColor = useCallback((theme: ThemeColor) => {
    document.documentElement.dataset.theme = theme;
  }, []);

  return setThemeColor;
};

export const useSetThemeAtRandom = () => {
  const setThemeColor = useSetThemeColor();

  useEffect(() => {
    const theme = themeColors[Math.floor(Math.random() * themeColors.length)];
    setThemeColor(theme);
  }, [setThemeColor]);
};
