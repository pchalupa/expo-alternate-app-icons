import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidColors,
  withDangerousMod,
} from '@expo/config-plugins';
import { ExpoConfig } from '@expo/config-types';
import { AlternateIcon } from '../types';
import { generateAdaptiveIcon } from './generateAdaptiveIcon';
import { toPascalCase } from '../utils';

const { Colors } = AndroidConfig;

export function withAdaptiveIconsGenerator(
  config: ExpoConfig,
  alternateIcons: AlternateIcon[],
): ExpoConfig {
  for (const alternateIcon of alternateIcons) {
    withAndroidAdaptiveIconColors(config, alternateIcon);
  }
  return withDangerousMod(config, [
    'android',
    async (config) => {
      for (const alternateIcon of alternateIcons) {
        const { android: adaptiveIcon, name } = alternateIcon;
        if (!adaptiveIcon) break;
        const { foregroundImage, backgroundColor } = adaptiveIcon;
        if (!foregroundImage) break;
        const projectRoot = config.modRequest.projectRoot;
        await generateAdaptiveIcon(name, projectRoot, adaptiveIcon);
      }
      return config;
    },
  ]);
}

const withAndroidAdaptiveIconColors: ConfigPlugin<AlternateIcon> = (config, alternateIcon) => {
  return withAndroidColors(config, (config) => {
    config.modResults = Colors.assignColorValue(config.modResults, {
      value: alternateIcon.android?.backgroundColor ?? '#FFFFFF',
      name: `iconBackground${toPascalCase(alternateIcon.name)}`,
    });
    return config;
  });
};
