/**
 * Restaurant Search and Filtering Service
 * Handles search logic and filter application
 */

/**
 * Filter restaurants based on multiple criteria
 * @param {Array} restaurants - Array of restaurant objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered restaurants
 */
export const filterRestaurants = (restaurants, filters) => {
  return restaurants.filter((restaurant) => {
    // Budget filter
    if (
      filters.budget &&
      (restaurant.avgPrice < filters.budget.min ||
        restaurant.avgPrice > filters.budget.max)
    ) {
      return false;
    }

    // Food filter - check menu items for selected foods
    if (
      filters.cuisine &&
      filters.cuisine.length > 0 &&
      restaurant.menu
    ) {
      const menuItemNames = restaurant.menu.map((item) =>
        item.name.toLowerCase()
      );
      const hasSelectedFood = filters.cuisine.some((foodId) => {
        const foodName = foodId.toLowerCase().replace(/_/g, ' ');
        return menuItemNames.some((menuItem) =>
          menuItem.includes(foodName)
        );
      });

      if (!hasSelectedFood) {
        return false;
      }
    }

    // Rating filter
    if (
      filters.rating &&
      restaurant.rating < filters.rating.min
    ) {
      return false;
    }

    // City filter
    if (
      filters.location &&
      filters.location.city &&
      filters.location.city.trim() !== ''
    ) {
      const cityLower = filters.location.city.toLowerCase();
      const restaurantCity = (restaurant.city || restaurant.location || '').toLowerCase();
      if (!restaurantCity.includes(cityLower)) {
        return false;
      }
    }

    // Distance filter
    if (
      filters.location &&
      filters.location.radius &&
      restaurant.distance > filters.location.radius
    ) {
      return false;
    }

    return true;
  });
};

/**
 * Sort restaurants based on criteria
 * @param {Array} restaurants - Array of restaurant objects
 * @param {string} sortBy - Sort criteria (rating, price, distance)
 * @returns {Array} Sorted restaurants
 */
export const sortRestaurants = (restaurants, sortBy = 'rating') => {
  const sorted = [...restaurants];

  switch (sortBy) {
    case 'price':
      sorted.sort((a, b) => a.avgPrice - b.avgPrice);
      break;

    case 'distance':
      sorted.sort((a, b) => a.distance - b.distance);
      break;

    case 'rating':
    default:
      sorted.sort((a, b) => b.rating - a.rating);
      break;
  }

  return sorted;
};

/**
 * Search restaurants by name or description
 * @param {Array} restaurants - Array of restaurant objects
 * @param {string} query - Search query
 * @returns {Array} Matching restaurants
 */
export const searchRestaurants = (restaurants, query) => {
  if (!query) return restaurants;

  const lowerQuery = query.toLowerCase();
  return restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(lowerQuery) ||
      restaurant.description?.toLowerCase().includes(lowerQuery) ||
      restaurant.cuisines?.some((c) =>
        c.toLowerCase().includes(lowerQuery)
      )
  );
};
