/**
 * Time Utility Functions
 * Provides functions to check restaurant open/closed status
 */

/**
 * Get current day name (Monday, Tuesday, etc.)
 * @returns {string} Day name in lowercase
 */
function getCurrentDayName() {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date();
  return days[today.getDay()];
}

/**
 * Get current time in HH:MM format
 * @returns {string} Current time like "14:30"
 */
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Compare two times in HH:MM format
 * @param {string} currentTime - Time to compare (HH:MM format)
 * @param {string} openTime - Opening time (HH:MM format)
 * @param {string} closeTime - Closing time (HH:MM format)
 * @returns {boolean} True if current time is within operating hours
 */
function isTimeWithinRange(currentTime, openTime, closeTime) {
  const [currentHour, currentMin] = currentTime.split(':').map(Number);
  const [openHour, openMin] = openTime.split(':').map(Number);
  const [closeHour, closeMin] = closeTime.split(':').map(Number);

  const currentTotalMin = currentHour * 60 + currentMin;
  const openTotalMin = openHour * 60 + openMin;
  const closeTotalMin = closeHour * 60 + closeMin;

  return currentTotalMin >= openTotalMin && currentTotalMin < closeTotalMin;
}

/**
 * Check if a restaurant is currently open
 * @param {Object} operatingHours - Restaurant operating hours object
 * @returns {Object} Status object with isOpen boolean and statusText
 */
function isRestaurantOpen(operatingHours) {
  if (!operatingHours) {
    return {
      isOpen: true, // Default to open if no hours set
      statusText: 'Open',
      nextStatus: 'Closes soon',
    };
  }

  const currentDayName = getCurrentDayName();
  const currentTime = getCurrentTime();
  const dayHours = operatingHours[currentDayName];

  if (!dayHours) {
    return {
      isOpen: true,
      statusText: 'Open',
      nextStatus: 'Check hours online',
    };
  }

  if (dayHours.closed) {
    return {
      isOpen: false,
      statusText: 'Closed',
      nextStatus: `Closed on ${currentDayName}`,
    };
  }

  const isWithinHours = isTimeWithinRange(currentTime, dayHours.open, dayHours.close);

  if (isWithinHours) {
    return {
      isOpen: true,
      statusText: 'Open',
      nextStatus: `Closes at ${dayHours.close}`,
    };
  } else {
    return {
      isOpen: false,
      statusText: 'Closed',
      nextStatus: `Opens at ${dayHours.open}`,
    };
  }
}

/**
 * Get restaurant operating hours for display
 * @param {Object} operatingHours - Operating hours object
 * @param {string} day - Day name (optional, defaults to today)
 * @returns {Object} Hours for the specified day
 */
function getHoursForDay(operatingHours, day = null) {
  const dayName = day || getCurrentDayName();
  return operatingHours?.[dayName] || { open: '10:00', close: '22:00', closed: false };
}

module.exports = {
  getCurrentDayName,
  getCurrentTime,
  isTimeWithinRange,
  isRestaurantOpen,
  getHoursForDay,
};
