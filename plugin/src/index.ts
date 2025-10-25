import { type ExpoConfig } from '@expo/config-types';

import { generateTypeIconsFile } from './generateTypeIconsFIle';
import { type AlternateIcon } from './types';
import { isPathArray, toAlternateIcon, toPascalCaseIconName } from './utils';
import { withAdaptiveIconsGenerator } from './withAdaptiveIconsGenerator';
import { withAlternateAppIconsGenerator } from './withAlternateAppIconsGenerator';
import { withAndroidManifestUpdate } from './withAndroidManifestUpdate';
import { withXcodeProjectUpdate } from './withXcodeProjectUpdate';

export default function withAlternateAppIcons(
  config: ExpoConfig,
  props: AlternateIcon[] | string[] = [],
): ExpoConfig {
  if (!props.length) return config;

  let alternateIcons: AlternateIcon[];

  if (isPathArray(props)) alternateIcons = props.map(toAlternateIcon).map(toPascalCaseIconName);
  else alternateIcons = props.map(toPascalCaseIconName);

  const iconNames = alternateIcons.map((icon) => icon.name);
  generateTypeIconsFile(iconNames);

  config = withAlternateAppIconsGenerator(config, alternateIcons);
  config = withXcodeProjectUpdate(config, iconNames);
  config = withAdaptiveIconsGenerator(config, alternateIcons);
  config = withAndroidManifestUpdate(config, iconNames);

  return config;
}
