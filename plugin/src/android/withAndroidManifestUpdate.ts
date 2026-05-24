import { AndroidConfig, withAndroidManifest } from '@expo/config-plugins';
import { type ExpoConfig, type Android } from '@expo/config-types';

import { toPascalCase, toSnakeCase } from '../utils';

type AndroidIntentFilters = NonNullable<Android['intentFilters']>;

const { getMainApplicationOrThrow, getMainActivityOrThrow } = AndroidConfig.Manifest;
const { default: renderIntentFilters, getIntentFilters } = AndroidConfig.IntentFilters;

type ActivityAlias = AndroidConfig.Manifest.ManifestActivity;

type ApplicationWithAliases = AndroidConfig.Manifest.ManifestApplication & {
  ['activity-alias']?: ActivityAlias[];
};

export function withAndroidManifestUpdate(config: ExpoConfig, alternateIconNames: string[]) {
  const intentFilters = getIntentFilters(config);

  config = withAndroidManifest(config, (config) => {
    const mainApplication = getMainApplicationOrThrow(config.modResults) as ApplicationWithAliases;
    const mainActivity = getMainActivityOrThrow(config.modResults);

    // Remove MAIN, LAUNCHER from the base MainActivity (not show icon, never be disabled)
    if (mainActivity['intent-filter']) {
      mainActivity['intent-filter'] = mainActivity['intent-filter'].filter((intentFilter: any) => {
        const isMain = intentFilter.action?.some(
          (a: any) => a.$['android:name'] === 'android.intent.action.MAIN',
        );
        const isLauncher = intentFilter.category?.some(
          (c: any) => c.$['android:name'] === 'android.intent.category.LAUNCHER',
        );
        return !(isMain && isLauncher);
      });
    }

    // Add default alias (default app icon, can safely be disabled)
    addActivityAliasToMainApplication(mainApplication, 'Default', intentFilters, true);

    // Add alternate aliases (alternate app icons)
    for (const name of alternateIconNames) {
      addActivityAliasToMainApplication(mainApplication, name, intentFilters, false);
    }

    return config;
  });

  return config;
}

function addActivityAliasToMainApplication(
  mainApplication: ApplicationWithAliases,
  iconName: string,
  intentFilters?: AndroidIntentFilters,
  isDefaultAlias: boolean = false,
) {
  const activityAlias: ActivityAlias = {
    $: {
      'android:name': `.MainActivity${toPascalCase(iconName)}`,
      'android:enabled': isDefaultAlias ? 'true' : 'false',
      'android:exported': 'true',
      ...(!isDefaultAlias && { 'android:icon': `@mipmap/ic_launcher_${toSnakeCase(iconName)}` }),
      'android:targetActivity': '.MainActivity',
    },
    'intent-filter': [
      {
        action: [{ $: { 'android:name': 'android.intent.action.MAIN' } }],
        category: [{ $: { 'android:name': 'android.intent.category.LAUNCHER' } }],
      },
      ...renderIntentFilters(intentFilters ?? []),
    ],
  };

  if (mainApplication['activity-alias']) {
    const currentIndex = mainApplication['activity-alias'].findIndex(
      (e: any) => e.$['android:name'] === activityAlias.$['android:name'],
    );
    if (currentIndex >= 0) {
      mainApplication['activity-alias'][currentIndex] = activityAlias;
    } else {
      mainApplication['activity-alias'].push(activityAlias);
    }
  } else {
    mainApplication['activity-alias'] = [activityAlias];
  }

  return mainApplication;
}
