import { generateImageAsync } from '@expo/image-utils';
import { IOSConfig } from 'expo/config-plugins';
import { writeFile, mkdir } from 'fs/promises';
import { join, parse } from 'path';

import { writeContentsJson } from './writeContentsJson';

export async function generateUniversalIcon(
  name: string,
  projectRoot: string,
  src: string,
  options: { width: number; height: number },
) {
  const { base: filename } = parse(src);
  const iosProjectPath = join(projectRoot, 'ios', IOSConfig.XcodeUtils.getProjectName(projectRoot));
  const appIconSetPath = join(iosProjectPath, `Images.xcassets/${name}.appiconset`);
  const appIconPath = join(appIconSetPath, filename);
  const { source } = await generateImageAsync(
    { projectRoot, cacheType: `alternate-app-icon-${name}` },
    {
      src,
      name,
      removeTransparency: true,
      backgroundColor: '#ffffff',
      resizeMode: 'cover',
      width: options.width,
      height: options.height,
    },
  );
  try {
    await mkdir(appIconSetPath, { recursive: true });
    await writeFile(appIconPath, source);
    await writeContentsJson(filename, appIconSetPath, options.width, options.height);
  } catch (error) {
    console.log(error);
  }
}
