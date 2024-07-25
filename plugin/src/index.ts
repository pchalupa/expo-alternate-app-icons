import { type ExpoConfig } from '@expo/config-types';

import { withAlternateAppIconsGenerator } from './withAlternateAppIconsGenerator';
import { withAndroidManifestUpdate } from './withAndroidManifestUpdate';
import { withXcodeProjectUpdate } from './withXcodeProjectUpdate';

export default function withAlternateAppIcons(
  config: ExpoConfig,
  iconPaths: string[] = [],
): ExpoConfig {
  const iconNames = new Set<string>();

  config = withAlternateAppIconsGenerator(config, iconPaths, iconNames);
  config = withXcodeProjectUpdate(config, iconNames);
  config = withAndroidManifestUpdate(config);

  return config;
}
