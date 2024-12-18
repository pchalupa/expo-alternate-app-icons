import { generateImageAsync } from '@expo/image-utils';
import { IOSConfig } from 'expo/config-plugins';
import { writeFile, mkdir } from 'fs/promises';
import { join, parse } from 'path';

import { AlternateIcon, iOSIconVariant } from './types';
import { writeContentsJson } from './writeContentsJson';

export async function generateUniversalIcon(
  name: string,
  projectRoot: string,
  src: AlternateIcon['ios'],
  options: { width: number; height: number },
) {
  const iosProjectPath = join(projectRoot, 'ios', IOSConfig.XcodeUtils.getProjectName(projectRoot));
  if (typeof src === 'string') {
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
  } else {
    const appIconSetPath = join(iosProjectPath, `Images.xcassets/${name}.appiconset`);
    const filenames: Record<string, string> = {};
    for (const ico in src) {
      let { base: filename } = parse(src[ico as iOSIconVariant]);
      filename = filename.replace('.', `-${ico}.`);
      filenames[ico] = filename;
      const appIconPath = join(appIconSetPath, filename);
      const { source } = await generateImageAsync(
        { projectRoot, cacheType: `alternate-app-icon-${name}-${ico}` },
        {
          src: src[ico as iOSIconVariant],
          name: ico,
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
      await writeContentsJson(filenames, appIconSetPath, options.width, options.height);
    } catch (e) {
      console.log(e);
    }
  }
}
