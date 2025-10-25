import { WarningAggregator } from 'expo/config-plugins';
import { parse } from 'path';

import { toPascalCase } from '../StringUtils';
import { type AlternateIcon } from '../types';

export function toAlternateIcon(path: string): AlternateIcon {
  const { name } = parse(path);

  return {
    name,
    ios: path,
    android: {
      foregroundImage: path,
    },
  };
}

export function toPascalCaseIconName(icon: AlternateIcon): AlternateIcon {
  if (icon.name.match(/^[a-z]/)) {
    WarningAggregator.addWarningAndroid(
      'expo-alternate-app-icons',
      `Alternate app icon name "${icon.name}" should be in PascalCase (e.g. "IconName").`,
    );

    return {
      ...icon,
      name: toPascalCase(icon.name),
    };
  }

  return icon;
}

export function isPathArray(
  alternateIcons: AlternateIcon[] | string[],
): alternateIcons is string[] {
  return alternateIcons.some((icon) => typeof icon === 'string');
}
