import { AndroidConfig, withAndroidManifest } from '@expo/config-plugins';
import { ExpoConfig } from '@expo/config-types';

export function withAndroidManifestUpdate(
  config: ExpoConfig,
  alternateIconNames: string[],
) {
  const { getMainApplicationOrThrow } = AndroidConfig.Manifest;

  config = withAndroidManifest(config, (config, ) => {
    const mainApplication = getMainApplicationOrThrow(config.modResults);

    for (const name of alternateIconNames) {
      addActivityAliasToMainApplication(mainApplication, name);
    }

    return config;
  });

  return config;
}

function addActivityAliasToMainApplication(
  mainApplication: AndroidConfig.Manifest.ManifestActivity,
  iconName: string,
) {
  // @ts-ignore
  mainApplication['activity-alias']?.push({
    $: {
      'android:name': `.MainActivity${iconName}`,
      'android:enabled': 'false',
      'android:exported': 'true',
      'android:icon': `@mipmap/ic_launcher_${iconName.toLowerCase()}`,
      'android:targetActivity': '.MainActivity',
    },
    'intent-filter': [
      {
        action: [{ $: { 'android:name': 'android.intent.action.MAIN' } }],
        category: [{ $: { 'android:name': 'android.intent.category.LAUNCHER' } }],
      },
    ],
  });
}
