// utils/formatters.ts

export const formatPrice = (
  price: number | undefined | null,
  currency: string = 'ETB',
  decimalPlaces: number = 2
): string => {
  if (price === undefined || price === null || isNaN(price)) {
    return `${currency} 0.00`; // Or handle as an error, or return empty string
  }

  // Ensure the price is a number and handle potential floating point inaccuracies for toFixed
  const numericPrice = Number(price);

  // Format with commas for thousands separator and fixed decimal places
  const formattedNumber = numericPrice.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  return `${currency} ${formattedNumber}`;
};

/**
 * Example of a more robust formatter using Intl.NumberFormat if needed,
 * but 'ETB' might not be universally supported as a currency code by Intl.
 * This is more for demonstration.
 */
export const formatPriceWithIntl = (
  price: number | undefined | null,
  locale: string = 'en-US', // Or 'am-ET' if available and desired for Amharic formatting
  currencyCode: string = 'ETB' // ISO 4217 code, 'ETB' is correct
): string => {
  if (price === undefined || price === null || isNaN(price)) {
    // Attempt to format zero with the currency symbol
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(0);
    } catch (e) {
      // Fallback if currency code is not supported by Intl
      return `${currencyCode} 0.00`;
    }
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode, // 'ETB' is the ISO 4217 code for Ethiopian Birr
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  } catch (e) {
    // Fallback for unsupported currency or other Intl errors
    console.warn(`Intl.NumberFormat failed for currency ${currencyCode}:`, e);
    // Use the simpler custom formatter as a fallback
    return formatPrice(price, currencyCode);
  }
};

// You can choose which one to export as the default or use them distinctly.
// For simplicity and guaranteed "ETB" prefix, the first `formatPrice` is often sufficient.
