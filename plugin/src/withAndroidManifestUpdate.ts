import { AndroidConfig, withAndroidManifest } from '@expo/config-plugins';
import { ExpoConfig } from '@expo/config-types';

export function withAndroidManifestUpdate(config: ExpoConfig) {
  const { getMainApplicationOrThrow } = AndroidConfig.Manifest;

  config = withAndroidManifest(config, (config) => {
    const mainApplication = getMainApplicationOrThrow(config.modResults);

    addActivityAliasToMainApplication(mainApplication);

    return config;
  });

  return config;
}

function addActivityAliasToMainApplication(
  mainApplication: AndroidConfig.Manifest.ManifestActivity,
) {
  // @ts-ignore
  mainApplication['activity-alias']?.push({
    $: {
      'android:name': '.MainActivityDark',
      'android:enabled': 'false',
      'android:exported': 'true',
      'android:icon': '@mipmap/ic_launcher_dark',
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
