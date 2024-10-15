import { type ExpoConfig } from '@expo/config-types';

import { withAlternateAppIconsGenerator } from './withAlternateAppIconsGenerator';
import { withAndroidManifestUpdate } from './withAndroidManifestUpdate';
import { withXcodeProjectUpdate } from './withXcodeProjectUpdate';
import { AlternateIcon } from './types';
import { withAdaptiveIconsGenerator } from './withAdaptiveIconsGenerator';
import { parse } from 'path';

const isPathArray = (alternateIcons: AlternateIcon[] | string[]): alternateIcons is string[] =>
  alternateIcons.some((icon) => typeof icon === 'string');

export default function withAlternateAppIcons(
  config: ExpoConfig,
  props: AlternateIcon[] | string[] = [],
): ExpoConfig {
  if (!props.length) {
    return config;
  }

  let alternateIcons: AlternateIcon[];
  if (isPathArray(props)) {
    alternateIcons = props.map(mapToAlternateIcon);
  } else {
    alternateIcons = props;
  }

  const iconNames = alternateIcons.map((icon) => icon.name);

  config = withAlternateAppIconsGenerator(config, alternateIcons);
  config = withXcodeProjectUpdate(config, iconNames);
  config = withAdaptiveIconsGenerator(config, alternateIcons);
  config = withAndroidManifestUpdate(config, iconNames);

  return config;
}

function mapToAlternateIcon(path: string): AlternateIcon {
  const { name } = parse(path);
  return {
    name,
    ios: path,
    android: {
      foregroundImage: path,
    }
  }
}