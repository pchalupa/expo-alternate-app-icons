import { type ExpoConfig } from '@expo/config-types';

import { withAlternateAppIconsGenerator } from './withAlternateAppIconsGenerator';
import { withXcodeProjectUpdate } from './withXcodeProjectUpdate';

export default function withAlternateAppIcons(
  config: ExpoConfig,
  iconPaths: string[] = [],
): ExpoConfig {
  const iconNames = new Set<string>();

  config = withAlternateAppIconsGenerator(config, iconPaths, iconNames);
  config = withXcodeProjectUpdate(config, iconNames);

  return config;
}
