import { AndroidConfig, withAndroidManifest } from '@expo/config-plugins';
import { ExpoConfig, Android } from '@expo/config-types';
import { toPascalCase, toSnakeCase } from './StringUtils';

type AndroidIntentFilters = NonNullable<Android['intentFilters']>;

const { getMainApplicationOrThrow } = AndroidConfig.Manifest;
const { default: renderIntentFilters, getIntentFilters } = AndroidConfig.IntentFilters;

type ActivityAlias = AndroidConfig.Manifest.ManifestActivity;

type ApplicationWithAliases = AndroidConfig.Manifest.ManifestApplication & {
  ['activity-alias']?: ActivityAlias[],
}

export function withAndroidManifestUpdate(
  config: ExpoConfig,
  alternateIconNames: string[],
) {
  const intentFilters = getIntentFilters(config);

  config = withAndroidManifest(config, (config, ) => {
    const mainApplication = getMainApplicationOrThrow(config.modResults);

    for (const name of alternateIconNames) {
      addActivityAliasToMainApplication(mainApplication, name, intentFilters);
    }

    return config;
  });

  return config;
}

function addActivityAliasToMainApplication(
  mainApplication: ApplicationWithAliases,
  iconName: string,
  intentFilters?: AndroidIntentFilters,
) {
  const activityAlias: ActivityAlias = {
    $: {
      'android:name': `.MainActivity${toPascalCase(iconName)}`,
      'android:enabled': 'false',
      'android:exported': 'true',
      'android:icon': `@mipmap/ic_launcher_${toSnakeCase(iconName)}`,
      'android:targetActivity': '.MainActivity',
    },
    'intent-filter': [
      {
        action: [{ $: { 'android:name': 'android.intent.action.MAIN' } }],
        category: [{ $: { 'android:name': 'android.intent.category.LAUNCHER' } }],
      },
      ...renderIntentFilters(intentFilters ?? []),
    ],
  }

  if (mainApplication['activity-alias']) {
    const currentIndex = mainApplication['activity-alias'].findIndex(
      (e: any) => e.$['android:name'] === activityAlias.$['android:name']
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
