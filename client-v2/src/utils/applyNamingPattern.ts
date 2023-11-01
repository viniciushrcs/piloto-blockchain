export const applyNamingPattern = (inputValue: string) => {
  return inputValue.replace(/[^a-z]/g, '').toLowerCase();
};
