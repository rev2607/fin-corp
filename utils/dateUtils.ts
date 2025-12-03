/**
 * Get date string in YYYY-MM-DD format from a Date object in local timezone
 */
export const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get date string from ISO date string (handles timezone conversion)
 * Converts to local timezone first, then extracts date part
 */
export const getDateStringFromISO = (isoString: string): string => {
  const date = new Date(isoString);
  return getLocalDateString(date);
};

/**
 * Check if a date is today (using local timezone)
 */
export const isToday = (date: Date | string): boolean => {
  const today = new Date();
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  
  const todayStr = getLocalDateString(today);
  const checkDateStr = getLocalDateString(checkDate);
  
  return todayStr === checkDateStr;
};

/**
 * Normalize a date to midnight in local timezone before converting to ISO
 * This ensures the date part is preserved regardless of timezone
 */
export const normalizeDateForStorage = (date: Date): string => {
  // Create a new date at midnight in local timezone
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  
  // Convert to ISO string - this will preserve the date part correctly
  // The timezone offset will be included but date comparison will work
  return normalized.toISOString();
};
