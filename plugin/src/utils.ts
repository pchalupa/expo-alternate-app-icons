import { WarningAggregator } from 'expo/config-plugins';
import fs from 'fs';
import { parse, resolve, dirname } from 'path';

import { type AlternateIcon } from './types';

/** Converts a file path to an AlternateIcon object with the file name as the icon name. */
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

/** Converts icon name to PascalCase if it starts with lowercase. */
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

/** Generates a TypeScript file containing the alternate icon names. */
export function generateTypeIconsFile(iconNames: string[]): void {
  const typeFilePath = resolve(__dirname, '../../src', 'AlternateAppIconsType.ts');

  const typeFileContent = `
/**
 * Auto-generated file. Do not edit manually.
 */
export type AlternateAppIcons = ${iconNames.map((name) => `'${name}'`).join(' | ')};
`;

  fs.mkdirSync(dirname(typeFilePath), { recursive: true });
  fs.writeFileSync(typeFilePath, typeFileContent.trim());
}

/** Checks if the input is an array of strings rather than AlternateIcon objects. */
export function isPathArray(
  alternateIcons: AlternateIcon[] | string[],
): alternateIcons is string[] {
  return alternateIcons.every((icon) => typeof icon === 'string');
}

/** Converts text to PascalCase by capitalizing each word and removing separators. */
export function toPascalCase(text: string): string {
  return text
    .replace(/[\s\-_]+/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\w+/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .replace(/\s+/g, '');
}

/** Converts text to snake_case by replacing separators and uppercase letters. */
export function toSnakeCase(text: string): string {
  return text
    .replace(/([A-Z])/g, '_$1')
    .replace(/[\s\-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}
