export const applyNamingPattern = (inputValue: string) => {
  return inputValue.replace(/[^a-z0-9-]/g, '-').toLowerCase();
};
