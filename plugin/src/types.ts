import type { ExpoConfig } from '@expo/config-types';

type AndroidConfig = Exclude<ExpoConfig['android'], undefined>;
type iOSIcon = string | Record<iOSIconVariant, string>;
export type iOSIconVariant = 'light' | 'dark' | 'tinted';
export type AlternateIcon = {
  name: string;
  ios: iOSIcon;
  android: AndroidConfig['adaptiveIcon'];
};
