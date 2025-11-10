import { TFunction } from 'i18next';

/**
 * Translates a vehicle name from the API to the current language.
 * Falls back to the original name if translation is not available.
 *
 * @param vehicleName - The vehicle name from the API (e.g., "Sedan")
 * @param t - The translation function from react-i18next
 * @returns Translated vehicle name
 */
export const translateVehicleName = (vehicleName: string, t: TFunction): string => {
  const translationKey = `vehicles.${vehicleName}`;
  const translated = t(translationKey);
  // If translation returns the key itself, it means translation is missing, return original
  return translated === translationKey ? vehicleName : translated;
};

/**
 * Translates an addon name from the API to the current language.
 * Falls back to the original name if translation is not available.
 *
 * @param addonName - The addon name from the API (e.g., "GPS Navigation")
 * @param t - The translation function from react-i18next
 * @returns Translated addon name
 */
export const translateAddonName = (addonName: string, t: TFunction): string => {
  const translationKey = `addons.${addonName}`;
  const translated = t(translationKey);
  // If translation returns the key itself, it means translation is missing, return original
  return translated === translationKey ? addonName : translated;
};


