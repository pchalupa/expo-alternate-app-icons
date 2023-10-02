import { type ExpoConfig } from '@expo/config-types';
import { withXcodeProject } from 'expo/config-plugins';

export function withXcodeProjectUpdate(
  config: ExpoConfig,
  alternateAppIconNames: Set<string>,
): ExpoConfig {
  config = withXcodeProject(config, (config) => {
    const property = 'ASSETCATALOG_COMPILER_ALTERNATE_APPICON_NAMES';

    config.modResults.updateBuildProperty(property, Array.from(alternateAppIconNames));

    return config;
  });

  return config;
}
