export const applyNamingPattern = (
  inputValue: string,
  patternType: 'withNumbers' | 'withoutNumbers' = 'withoutNumbers'
) => {
  if (patternType === 'withNumbers') {
    return inputValue.replace(/[^a-z0-9]/g, '').toLowerCase();
  } else {
    return inputValue.replace(/[^a-z]/g, '').toLowerCase();
  }
};
