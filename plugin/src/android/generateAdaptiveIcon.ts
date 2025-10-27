import { compositeImagesAsync, generateImageAsync } from '@expo/image-utils';
import { writeFile, mkdir, rm } from 'fs/promises';
import path from 'path';

import { AlternateIcon } from '../types';
import { toPascalCase, toSnakeCase } from '../utils';

type DPIString = 'mdpi' | 'hdpi' | 'xhdpi' | 'xxhdpi' | 'xxxhdpi';
type dpiMap = Record<DPIString, { folderName: string; scale: number }>;

const BASELINE_PIXEL_SIZE = 108;
export const ANDROID_RES_PATH = 'android/app/src/main/res/';
const MIPMAP_ANYDPI_V26 = 'mipmap-anydpi-v26';
export const dpiValues: dpiMap = {
  mdpi: { folderName: 'mipmap-mdpi', scale: 1 },
  hdpi: { folderName: 'mipmap-hdpi', scale: 1.5 },
  xhdpi: { folderName: 'mipmap-xhdpi', scale: 2 },
  xxhdpi: { folderName: 'mipmap-xxhdpi', scale: 3 },
  xxxhdpi: { folderName: 'mipmap-xxxhdpi', scale: 4 },
};

export async function generateAdaptiveIcon(
  name: string,
  projectRoot: string,
  adaptiveIcon: Exclude<AlternateIcon['android'], undefined>,
) {
  const { foregroundImage, backgroundImage, backgroundColor, monochromeImage } = adaptiveIcon;
  if (!foregroundImage) return;

  const snake_case_name = toSnakeCase(name);
  const isAdaptive = Boolean(backgroundImage || backgroundColor);

  // generate legacy icons
  await generateMultiLayerImageAsync(projectRoot, {
    icon: foregroundImage,
    backgroundImage,
    backgroundColor,
    outputImageFileName: `ic_launcher_${snake_case_name}.png`,
    imageCacheFolder: `android-standard-square-${snake_case_name}`,
    backgroundImageCacheFolder: `android-standard-square-background-${snake_case_name}`,
  });

  if (!isAdaptive) {
    return;
  }

  if (monochromeImage) {
    await generateMonochromeImageAsync(projectRoot, {
      icon: monochromeImage,
      imageCacheFolder: `android-adaptive-monochrome-${snake_case_name}`,
      outputImageFileName: `ic_launcher_monochrome_${snake_case_name}.png`,
    });
  }

  // generate adaptive icons
  await generateMultiLayerImageAsync(projectRoot, {
    backgroundColor: 'transparent',
    backgroundImage,
    backgroundImageCacheFolder: `android-adaptive-background-${snake_case_name}`,
    outputImageFileName: `ic_launcher_foreground_${snake_case_name}.png`,
    icon: foregroundImage,
    imageCacheFolder: `android-adaptive-foreground-${snake_case_name}`,
    backgroundImageFileName: `ic_launcher_background_${snake_case_name}.png`,
  });

  // create ic_launcher.xml
  const icLauncherXmlString = createAdaptiveIconXmlString(name, backgroundImage, monochromeImage);
  await createAdaptiveIconXmlFiles(name, projectRoot, icLauncherXmlString);
}

async function generateMultiLayerImageAsync(
  projectRoot: string,
  {
    icon,
    backgroundColor,
    backgroundImage,
    imageCacheFolder,
    backgroundImageCacheFolder,
    borderRadiusRatio,
    outputImageFileName,
    backgroundImageFileName,
  }: {
    icon: string;
    backgroundImage?: string;
    backgroundColor?: string;
    imageCacheFolder: string;
    backgroundImageCacheFolder: string;
    backgroundImageFileName?: string;
    borderRadiusRatio?: number;
    outputImageFileName: string;
  },
) {
  await iterateDpiValues(projectRoot, async ({ dpiFolder, scale }) => {
    let iconLayer = await generateIconAsync(projectRoot, {
      cacheType: imageCacheFolder,
      src: icon,
      scale,
      // backgroundImage overrides backgroundColor
      backgroundColor: backgroundImage ? 'transparent' : (backgroundColor ?? 'transparent'),
      borderRadiusRatio,
    });

    if (backgroundImage) {
      const backgroundLayer = await generateIconAsync(projectRoot, {
        cacheType: backgroundImageCacheFolder,
        src: backgroundImage,
        scale,
        backgroundColor: 'transparent',
        borderRadiusRatio,
      });

      if (backgroundImageFileName) {
        await writeFile(path.resolve(dpiFolder, backgroundImageFileName), backgroundLayer);
      } else {
        iconLayer = await compositeImagesAsync({
          foreground: iconLayer,
          background: backgroundLayer,
        });
      }
    } else if (backgroundImageFileName) {
      // Remove any instances of ic_launcher_background.png that are there from previous icons
      await deleteIconNamedAsync(projectRoot, backgroundImageFileName);
    }

    await mkdir(dpiFolder, { recursive: true });
    await writeFile(path.resolve(dpiFolder, outputImageFileName), iconLayer);
  });
}

async function generateMonochromeImageAsync(
  projectRoot: string,
  {
    icon,
    imageCacheFolder,
    outputImageFileName,
  }: { icon: string; imageCacheFolder: string; outputImageFileName: string },
) {
  await iterateDpiValues(projectRoot, async ({ dpiFolder, scale }) => {
    const monochromeIcon = await generateIconAsync(projectRoot, {
      cacheType: imageCacheFolder,
      src: icon,
      scale,
      backgroundColor: 'transparent',
    });
    await mkdir(dpiFolder, { recursive: true });
    await writeFile(path.resolve(dpiFolder, outputImageFileName), monochromeIcon);
  });
}

async function deleteIconNamedAsync(projectRoot: string, name: string) {
  return iterateDpiValues(projectRoot, ({ dpiFolder }) => {
    return rm(path.resolve(dpiFolder, name), { force: true });
  });
}

function iterateDpiValues(
  projectRoot: string,
  callback: (value: { dpiFolder: string; folderName: string; scale: number }) => Promise<void>,
) {
  return Promise.all(
    Object.values(dpiValues).map((value) =>
      callback({
        dpiFolder: path.resolve(projectRoot, ANDROID_RES_PATH, value.folderName),
        ...value,
      }),
    ),
  );
}

async function generateIconAsync(
  projectRoot: string,
  {
    cacheType,
    src,
    scale,
    backgroundColor,
    borderRadiusRatio,
  }: {
    cacheType: string;
    src: string;
    scale: number;
    backgroundColor: string;
    borderRadiusRatio?: number;
  },
) {
  const iconSizePx = BASELINE_PIXEL_SIZE * scale;

  return (
    await generateImageAsync(
      { projectRoot, cacheType },
      {
        src,
        width: iconSizePx,
        height: iconSizePx,
        resizeMode: 'cover',
        backgroundColor,
        borderRadius: borderRadiusRatio ? iconSizePx * borderRadiusRatio : undefined,
      },
    )
  ).source;
}

export const createAdaptiveIconXmlString = (
  name: string,
  backgroundImage?: string,
  monochromeImage?: string,
) => {
  const snake_case_name = toSnakeCase(name);
  const PascalCaseName = toPascalCase(name);

  const background = backgroundImage
    ? `@mipmap/ic_launcher_background_${snake_case_name}`
    : `@color/iconBackground${PascalCaseName}`;

  const iconElements: string[] = [
    `<background android:drawable="${background}"/>`,
    `<foreground android:drawable="@mipmap/ic_launcher_foreground_${snake_case_name}"/>`,
  ];

  if (monochromeImage) {
    iconElements.push(
      `<monochrome android:drawable="@mipmap/ic_launcher_monochrome_${snake_case_name}"/>`,
    );
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    ${iconElements.join('\n    ')}
</adaptive-icon>`;
};

async function createAdaptiveIconXmlFiles(
  name: string,
  projectRoot: string,
  icLauncherXmlString: string,
) {
  const anyDpiV26Directory = path.resolve(projectRoot, ANDROID_RES_PATH, MIPMAP_ANYDPI_V26);
  await mkdir(anyDpiV26Directory, { recursive: true });
  const launcherPath = path.resolve(anyDpiV26Directory, `ic_launcher_${toSnakeCase(name)}.xml`);
  await writeFile(launcherPath, icLauncherXmlString);
}
