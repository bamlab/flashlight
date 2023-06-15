export const themeColors = [
  "bright-yellow",
  "bright-green",
  "bright-magenta",
  "bright-cyan",
] as const;
type ThemeColor = typeof themeColors[number];

let COLOR_PALETTE: string[] = [];

export const getThemeColor = (): ThemeColor =>
  document.documentElement.dataset.theme as ThemeColor;

export const setThemeAtRandom = () => {
  document.documentElement.dataset.theme =
    themeColors[Math.floor(Math.random() * themeColors.length)];
  COLOR_PALETTE = getThemeColorPalette().map((color) => `var(--${color})`);
};

export const getThemeColorPalette = () => {
  const mainThemeColor = getThemeColor();

  const colorsStartingWithMainTheme = themeColors.map(
    (_, i) =>
      themeColors[
        (themeColors.indexOf(mainThemeColor) + i) % themeColors.length
      ]
  );

  return colorsStartingWithMainTheme;
};

export const getColorPalette = () => COLOR_PALETTE;
