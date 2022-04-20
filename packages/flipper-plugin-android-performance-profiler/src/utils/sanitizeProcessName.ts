export const sanitizeProcessName = (name: string) => {
  return name.slice(
    name[0] === "(" ? 1 : 0,
    name.length - (name[name.length - 1] === ")" ? 1 : 0)
  );
};
