import type { ExpoConfig } from '@expo/config-types';

type AndroidConfig = Exclude<ExpoConfig['android'], undefined>;
type iOSConfig = Exclude<ExpoConfig['ios'], undefined>;

export type AlternateIcon = {
  name: string;
  ios: iOSConfig['icon'];
  android: AndroidConfig['adaptiveIcon']
}
