import { IOSConfig } from 'expo/config-plugins';
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
    console.log(error);
  }
}
