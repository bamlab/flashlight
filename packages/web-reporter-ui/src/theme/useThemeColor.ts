export const themeColors = [
  "bright-yellow",
  "bright-green",
  "bright-magenta",
  "bright-cyan",
] as const;
type ThemeColor = typeof themeColors[number];

export const getThemeColor = (): ThemeColor =>
  document.documentElement.dataset.theme as ThemeColor;

export const setThemeAtRandom = () => {
  document.documentElement.dataset.theme =
    themeColors[Math.floor(Math.random() * themeColors.length)];
};
