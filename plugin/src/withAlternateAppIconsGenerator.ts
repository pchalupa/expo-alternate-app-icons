import { type ExpoConfig } from '@expo/config-types';
import { withDangerousMod } from 'expo/config-plugins';

import { generateUniversalIcon } from './generateUniversalIcon';
import { AlternateIcon } from './types';

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
        await generateUniversalIcon(name, projectRoot, iconPath, {
          width: 1024,
          height: 1024,
        });
      }

      return config;
    },
  ]);
}
