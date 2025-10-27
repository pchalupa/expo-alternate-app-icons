import { type ExpoConfig } from '@expo/config-types';

import { type AlternateIcon } from './types';
import { generateTypeIconsFile, isPathArray, toAlternateIcon, toPascalCaseIconName } from './utils';
import { withAdaptiveIconsGenerator } from './android/withAdaptiveIconsGenerator';
import { withAlternateAppIconsGenerator } from './ios/withAlternateAppIconsGenerator';
import { withAndroidManifestUpdate } from './android/withAndroidManifestUpdate';
import { withXcodeProjectUpdate } from './ios/withXcodeProjectUpdate';

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
