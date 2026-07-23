/**
 * Format the category icon name by replacing underscores with spaces and converting to capital case.
 */
export const snake_CaseToNormalTitle = (name: string): string => {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
};
