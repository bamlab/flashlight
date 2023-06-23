// from https://stackoverflow.com/questions/17998978/removing-colors-from-output
// Remove colors so that snapshots are not polluted
export const removeCLIColors = (str?: string) =>
  // eslint-disable-next-line no-control-regex
  str?.replace(/\x1B\[([0-9]{1,3}(;[0-9]{1,2};?)?)?[mGK]/g, "");
