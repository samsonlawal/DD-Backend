/**
 * Formats product fields like ABV, Volume, and Shipping Weight to include standard units.
 * This is useful when using .lean() which bypasses Mongoose schema transforms.
 */
const formatProduct = (product) => {
  if (!product) return null;

  // Clone to avoid mutating original if needed, though with .lean() it's already a POJO
  const formatted = { ...product };

  // ABV Unit Format
  if (formatted.specifications?.abv) {
    const abv = formatted.specifications.abv.toString().trim();
    if (abv && !abv.endsWith("%")) {
      formatted.specifications.abv = `${abv} %`;
    }
  }

  // Volume Unit Format
  if (formatted.specifications?.volume) {
    const vol = formatted.specifications.volume.toString().trim();
    if (
      vol &&
      !vol.toLowerCase().endsWith("cl") &&
      !vol.toLowerCase().endsWith("ml") &&
      !vol.toLowerCase().endsWith("l")
    ) {
      formatted.specifications.volume = `${vol} cl`;
    }
  }

  // Shipping Weight Unit Format
  if (formatted.shippingWeight !== undefined && formatted.shippingWeight !== null) {
    const weight = formatted.shippingWeight.toString().trim();
    if (
      weight &&
      !weight.toLowerCase().endsWith("kg") &&
      !weight.toLowerCase().endsWith("g")
    ) {
      formatted.shippingWeight = `${weight} kg`;
    }
  }

  return formatted;
};

/**
 * Formats an array of products.
 */
const formatProducts = (products) => {
  if (!Array.isArray(products)) return [];
  return products.map(formatProduct);
};

module.exports = {
  formatProduct,
  formatProducts,
};
