import { type ExpoConfig } from '@expo/config-types';

import { withAlternateAppIconsGenerator } from './withAlternateAppIconsGenerator';
import { withAndroidManifestUpdate } from './withAndroidManifestUpdate';
import { withXcodeProjectUpdate } from './withXcodeProjectUpdate';
import { AlternateIcon } from './types';
import { withAdaptiveIconsGenerator } from './withAdaptiveIconsGenerator';

export default function withAlternateAppIcons(
  config: ExpoConfig,
  alternateIcons: AlternateIcon[] = [],
): ExpoConfig {
  const iconNames = alternateIcons.map((icon) => icon.name);
  config = withAlternateAppIconsGenerator(config, alternateIcons);
  config = withXcodeProjectUpdate(config, iconNames);
  config = withAdaptiveIconsGenerator(config, alternateIcons);
  config = withAndroidManifestUpdate(config, iconNames);

  return config;
}
