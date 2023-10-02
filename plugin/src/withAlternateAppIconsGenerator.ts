import { type ExpoConfig } from '@expo/config-types';
import { withDangerousMod } from 'expo/config-plugins';

import { generateUniversalIcon } from './generateUniversalIcon';

export function withAlternateAppIconsGenerator(
  config: ExpoConfig,
  alternateIcons: string[],
  alternateAppIconNames: Set<string>,
): ExpoConfig {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      for await (const iconPath of alternateIcons) {
        const projectRoot = config.modRequest.projectRoot;
        const name = await generateUniversalIcon(projectRoot, iconPath, {
          width: 1024,
          height: 1024,
        });

        alternateAppIconNames.add(name);
      }

      return config;
    },
  ]);
}
