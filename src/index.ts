import ExpoAlternateAppIconsModule from './ExpoAlternateAppIconsModule';

/**
 * A boolean value indicating whether the current device supports alternate app icons.
 *
 * @type {boolean}
 *
 * @example
 * // Check if the device supports alternate app icons.
 * if (supportsAlternateIcons) {
 *   console.log('Alternate app icons are supported on this device.');
 * } else {
 *   console.log('Alternate app icons are not supported on this device.');
 * }
 */
export const supportsAlternateIcons: boolean = ExpoAlternateAppIconsModule.supportsAlternateIcons;

/**
 * Sets the alternate app icon for the application.
 *
 * @param {string | null} name - The name of the alternate app icon to set. Pass `null` to reset to the default icon.
 * @returns {Promise<string>} A Promise that resolves to a icon name.
 * @throws {Error} Throws an error if there is an issue with setting the alternate app icon.
 *
 * @example
 * // Set an alternate app icon named 'icon2'.
 * const result = await setAlternateAppIcon('icon2');
 *
 * // Reset to the default app icon.
 * const resetResult = await setAlternateAppIcon(null);
 */
export async function setAlternateAppIcon(name: string | null): Promise<string> {
  return await ExpoAlternateAppIconsModule.setAlternateAppIcon(name);
}

/**
 * Retrieves the name of the currently active app icon.
 *
 * @returns {string} The name of the currently active app icon.
 *
 * @example
 * // Get the name of the currently active app icon.
 * const iconName = getAppIconName();
 * console.log(`The active app icon is: ${iconName}`);
 */
export function getAppIconName(): string {
  return ExpoAlternateAppIconsModule.getAppIconName();
}
