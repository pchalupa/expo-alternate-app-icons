import { type ExpoConfig } from '@expo/config-types';
import { withXcodeProject } from 'expo/config-plugins';

const ALTERNATE_APP_ICONS_NAMES_PROPERTY = 'ASSETCATALOG_COMPILER_ALTERNATE_APPICON_NAMES';

export function withXcodeProjectUpdate(
  config: ExpoConfig,
  alternateAppIconNames: string[],
): ExpoConfig {
  config = withXcodeProject(config, (config) => {
    config.modResults.updateBuildProperty(
      ALTERNATE_APP_ICONS_NAMES_PROPERTY,
      alternateAppIconNames,
    );

    return config;
  });

  return config;
}
