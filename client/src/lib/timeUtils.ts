/**
 * Converts a 24-hour time string (HH:MM) to 12-hour format with AM/PM
 * @param time24 - Time in 24-hour format (e.g., "14:30") or 12-hour format (e.g., "2:30 PM")
 * @returns Time in 12-hour format with AM/PM (e.g., "2:30 PM")
 */
export function convertTo12HourFormat(time24: string): string {
  try {
    // Handle empty or undefined input
    if (!time24 || time24.trim() === '') return '';
    
    // Handle case where time might already be in 12-hour format
    if (time24.includes('AM') || time24.includes('PM')) {
      // If it's already in 12-hour format, return as is
      return time24;
    }
    
    // Split hours and minutes
    const [hoursStr, minutesStr] = time24.split(':');
    if (!hoursStr || !minutesStr) return time24;
    
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    // Validate hours and minutes
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return time24;
    }
    
    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error converting time format:', error, 'Input:', time24);
    return time24;
  }
}