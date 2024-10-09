import { AlternateIcon } from './types';
import { compositeImagesAsync, generateImageAsync } from '@expo/image-utils';
import fs from 'fs-extra';
import path from 'path';

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

  const lowercased_name = name.toLowerCase();
  const isAdaptive = Boolean(backgroundImage || backgroundColor);

  // generate legacy icons
  await generateMultiLayerImageAsync(projectRoot, {
    icon: foregroundImage,
    backgroundImage,
    backgroundColor,
    outputImageFileName: `ic_launcher_${lowercased_name}.png`,
    imageCacheFolder: `android-standard-square-${lowercased_name}`,
    backgroundImageCacheFolder: `android-standard-square-background-${lowercased_name}`,
  });

  if (monochromeImage) {
    await generateMonochromeImageAsync(projectRoot, {
      icon: monochromeImage,
      imageCacheFolder: `android-adaptive-monochrome-${lowercased_name}`,
      outputImageFileName: `ic_launcher_monochrome_${lowercased_name}.png`,
    });
  }

  // generate adaptive icons
  await generateMultiLayerImageAsync(projectRoot, {
    backgroundColor: 'transparent',
    backgroundImage: backgroundImage,
    backgroundImageCacheFolder: `android-adaptive-background-${lowercased_name}`,
    outputImageFileName: `ic_launcher_foreground_${lowercased_name}.png`,
    icon: foregroundImage,
    imageCacheFolder: `android-adaptive-foreground-${lowercased_name}`,
    backgroundImageFileName: `ic_launcher_background_${lowercased_name}.png`,
  });

  // create ic_launcher.xml
  const icLauncherXmlString = createAdaptiveIconXmlString(name, backgroundImage, monochromeImage);
  await createAdaptiveIconXmlFiles(
    name,
    projectRoot,
    icLauncherXmlString,
    isAdaptive,
  );
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
  }
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
        await fs.writeFile(path.resolve(dpiFolder, backgroundImageFileName), backgroundLayer);
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

    await fs.ensureDir(dpiFolder);
    await fs.writeFile(path.resolve(dpiFolder, outputImageFileName), iconLayer);
  });
}

async function generateMonochromeImageAsync(
  projectRoot: string,
  {
    icon,
    imageCacheFolder,
    outputImageFileName,
  }: { icon: string; imageCacheFolder: string; outputImageFileName: string }
) {
  await iterateDpiValues(projectRoot, async ({ dpiFolder, scale }) => {
    const monochromeIcon = await generateIconAsync(projectRoot, {
      cacheType: imageCacheFolder,
      src: icon,
      scale,
      backgroundColor: 'transparent',
    });
    await fs.ensureDir(dpiFolder);
    await fs.writeFile(path.resolve(dpiFolder, outputImageFileName), monochromeIcon);
  });
}

async function deleteIconNamedAsync(projectRoot: string, name: string) {
  return iterateDpiValues(projectRoot, ({ dpiFolder }) => {
    return fs.remove(path.resolve(dpiFolder, name));
  });
}

function iterateDpiValues(
  projectRoot: string,
  callback: (value: { dpiFolder: string; folderName: string; scale: number }) => Promise<void>
) {
  return Promise.all(
    Object.values(dpiValues).map((value) =>
      callback({
        dpiFolder: path.resolve(projectRoot, ANDROID_RES_PATH, value.folderName),
        ...value,
      })
    )
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
  }
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
      }
    )
  ).source;
}

export const createAdaptiveIconXmlString = (
  name: string,
  backgroundImage?: string,
  monochromeImage?: string
) => {
  const background = backgroundImage
    ? `@mipmap/ic_launcher_background_${name.toLowerCase()}`
    : `@color/iconBackground${name}`;

  const iconElements: string[] = [
    `<background android:drawable="${background}"/>`,
    `<foreground android:drawable="@mipmap/ic_launcher_foreground_${name.toLowerCase()}"/>`,
  ];

  if (monochromeImage) {
    iconElements.push(`<monochrome android:drawable="@mipmap/ic_launcher_monochrome_${name.toLowerCase()}"/>`);
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
  add: boolean
) {
  const anyDpiV26Directory = path.resolve(projectRoot, ANDROID_RES_PATH, MIPMAP_ANYDPI_V26);
  await fs.ensureDir(anyDpiV26Directory);
  const launcherPath = path.resolve(anyDpiV26Directory, `ic_launcher_${name.toLowerCase()}.xml`);
  if (add) {
    await fs.writeFile(launcherPath, icLauncherXmlString);
  } else {
    // Remove the xml if the icon switches from adaptive to standard.
    if (fs.existsSync(launcherPath)) {
      await fs.remove(launcherPath);
    }
  }
}
