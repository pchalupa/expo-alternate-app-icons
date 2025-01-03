import { type ExpoConfig } from '@expo/config-types';
import { withDangerousMod } from 'expo/config-plugins';

import { generateUniversalIcon, generateUniversalVariantsIcon } from './generateUniversalIcon';
import { AlternateIcon, isIosVariantsIcon } from './types';

export function withAlternateAppIconsGenerator(
  config: ExpoConfig,
  alternateIcons: AlternateIcon[],
): ExpoConfig {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      for await (const alternateIcon of alternateIcons) {
        const { ios: iconPath, name } = alternateIcon;
        if (!iconPath) break;
        const projectRoot = config.modRequest.projectRoot;

        if (typeof iconPath === 'string') {
          await generateUniversalIcon(name, projectRoot, iconPath, {
            width: 1024,
            height: 1024,
          });
        } else if (isIosVariantsIcon(iconPath)) {
          await generateUniversalVariantsIcon(name, projectRoot, iconPath, {
            width: 1024,
            height: 1024,
          });
        } else {
          throw new Error(
            `Invalid alternate icon configuration for "${alternateIcon.name}". Ensure the iconPath is either a string for a single icon or an object containing "dark", "light", and "tinted" variants.`,
          );
        }
      }

      return config;
    },
  ]);
}
