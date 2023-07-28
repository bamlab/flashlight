export const sanitizeProcessName = (name: string) => {
  return name[0] === "("
    ? // Keeping this for old results.json files containing thread names like "(thread)" or "(thread"
      // "thread)" was never happening
      name.slice(1, name.length - (name[name.length - 1] === ")" ? 1 : 0))
    : name;
};
