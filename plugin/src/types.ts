import type { ExpoConfig } from '@expo/config-types';

type AndroidConfig = Exclude<ExpoConfig['android'], undefined>;
type iOSConfig = Exclude<ExpoConfig['ios'], undefined>;
export type iOSVariantsIcon = Record<iOSVariants, string>;
export type iOSVariants = 'light' | 'dark' | 'tinted';

export type AlternateIcon = {
  name: string;
  ios: iOSConfig['icon'] | iOSVariantsIcon;
  android: AndroidConfig['adaptiveIcon'];
};

export const isIosVariantsIcon = (iconPath: unknown): iconPath is iOSVariantsIcon =>
  typeof iconPath === 'object' &&
  iconPath != null &&
  'dark' in iconPath &&
  'light' in iconPath &&
  'tinted' in iconPath &&
  typeof iconPath.dark === 'string' &&
  typeof iconPath.light === 'string' &&
  typeof iconPath.tinted === 'string';
