import { type ExpoConfig } from '@expo/config-types';
import { IOSConfig, withXcodeProject, type XcodeProject } from 'expo/config-plugins';
import { extname } from 'path';

import { type AlternateIcon } from '../types';

const ALTERNATE_APP_ICONS_NAMES_PROPERTY = 'ASSETCATALOG_COMPILER_ALTERNATE_APPICON_NAMES';

export function withXcodeProjectUpdate(
  config: ExpoConfig,
  alternateIcons: AlternateIcon[],
): ExpoConfig {
  config = withXcodeProject(config, (config) => {
    const alternateAppIconNames = alternateIcons.map((icon) => icon.name);
    const projectName = config.modRequest.projectName;

    config.modResults.updateBuildProperty(
      ALTERNATE_APP_ICONS_NAMES_PROPERTY,
      alternateAppIconNames,
    );

    if (projectName) {
      for (const icon of alternateIcons) {
        // add liquid glass icon to the Xcode project
        if (typeof icon.ios === 'string' && extname(icon.ios) === '.icon') {
          addIconFileToProject(config.modResults, projectName, icon.name);
        }
      }
    }

    return config;
  });

  return config;
}

function addIconFileToProject(project: XcodeProject, projectName: string, iconName: string): void {
  const iconPath = `${iconName}.icon`;

  IOSConfig.XcodeUtils.addResourceFileToGroup({
    filepath: `${projectName}/${iconPath}`,
    groupName: projectName,
    project,
    isBuildFile: true,
    verbose: true,
  });
}
