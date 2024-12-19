import { generateImageAsync } from '@expo/image-utils';
import { IOSConfig } from 'expo/config-plugins';
import { writeFile, mkdir } from 'fs/promises';
import { join, parse } from 'path';

import { iOSVariants, iOSVariantsIcon } from './types';
import { writeContentsJson, writeVariantsContentsJson } from './writeContentsJson';

export async function generateUniversalIcon(
  name: string,
  projectRoot: string,
  src: string,
  options: { width: number; height: number },
) {
  const iosProjectPath = join(projectRoot, 'ios', IOSConfig.XcodeUtils.getProjectName(projectRoot));
  const { base: filename } = parse(src);
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

export async function generateUniversalVariantsIcon(
  name: string,
  projectRoot: string,
  sources: iOSVariantsIcon,
  options: { width: number; height: number },
) {
  const iosProjectPath = join(projectRoot, 'ios', IOSConfig.XcodeUtils.getProjectName(projectRoot));
  const appIconSetPath = join(iosProjectPath, `Images.xcassets/${name}.appiconset`);
  const filenames: Record<string, string> = {};
  for (const key in sources) {
    const variant = key as iOSVariants;
    let { base: filename } = parse(sources[variant]);
    filename = filename.replace('.', `-${variant}.`);
    filenames[variant] = filename;
    const appIconPath = join(appIconSetPath, filename);
    const { source } = await generateImageAsync(
      { projectRoot, cacheType: `alternate-app-icon-${name}-${variant}` },
      {
        src: sources[variant],
        name: variant,
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
    } catch (error) {
      console.log(error);
    }
  }

  try {
    await writeVariantsContentsJson(filenames, appIconSetPath, options.width, options.height);
  } catch (error) {
    console.log(error);
  }
}
