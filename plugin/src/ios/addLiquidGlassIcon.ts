import { IOSConfig, WarningAggregator } from 'expo/config-plugins';
import { cp } from 'fs/promises';
import { join } from 'path';

export async function addLiquidGlassIcon(
  name: string,
  projectRoot: string,
  src: string,
): Promise<void> {
  const iosProjectPath = join(projectRoot, 'ios', IOSConfig.XcodeUtils.getProjectName(projectRoot));
  const appIconPath = join(iosProjectPath, `${name}.icon`);
  const iconPath = join(projectRoot, src);

  try {
    await cp(iconPath, appIconPath, { recursive: true });
  } catch (error) {
    WarningAggregator.addWarningIOS(
      'expo-alternate-app-icons',
      `Failed to copy liquid glass icon "${name}": ${error}`,
    );
  }
}
