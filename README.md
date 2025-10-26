# Expo Alternate App Icons

Expo Alternate App Icons is a library that allows you to easily switch between different app icons in your Expo project.

### Platform Compatibility

| Android Device | Android Emulator | iOS Device | iOS Simulator | Web |
| -------------- | ---------------- | ---------- | ------------- | --- |
| ✅             | ✅               | ✅         | ✅            | ❌  |

## Introduction

Customizing app icons can be a valuable way to provide users with a personalized experience for your app. This library simplifies the process of implementing alternate app icons in your Expo project.

### Demo

<p align="center">
	<img src="https://github.com/pchalupa/readme-assets/blob/main/expo-alternate-app-icons.gif" alt="demo" width="75%" />
</p>

## Installation

To get started, install the library using Expo CLI:

```sh
npx expo install expo-alternate-app-icons
```

> Ensure your project is running Expo SDK 51+.

## How To Use

This package contains an Expo Plugin that copies your alternative icons to native projects.

1. Add `expo-alternate-app-icons` to the plugins array inside your [app.json](https://docs.expo.dev/versions/latest/config/app/).
2. The second item in the array accepts an array with details about your alternate icons.
3. [Prebuild](https://docs.expo.dev/workflow/prebuild/) a project using `npx expo prebuild --clean` to apply the plugin changes.

```json5
// app.json
{
  // ...
  plugins: [
    // ...
    [
      'expo-alternate-app-icons',
      [
        {
          name: 'IconA', // The name of the alternate icon, follow PascalCase convention
          ios: {
            light: './assets/icon-a.png',
            dark: './assets/icon-a-dark.png',
            tinted: './assets/icon-a-tinted.png',
          }, // Path to the iOS app icons or if you do not want to use the variants enter directly the path
          android: {
            foregroundImage: './assets/icon-a-foreground.png', // Path to Android foreground image
            backgroundColor: '#001413', // Background color for Android adaptive icon
          },
        },
        {
          name: 'IconB',
          ios: './assets/icon-b.png', // Without variants,
          android: {
            foregroundImage: './assets/icon-b-foreground.png',
            backgroundColor: '#001413',
          },
        },
        {
          name: 'IconC',
          ios: './assets/icon-c.png',
          android: {
            foregroundImage: './assets/icon-c-foreground.png',
            backgroundColor: '#001413',
          },
        },
      ],
    ],
  ],
}
```

> **Note:** Icon names are automatically converted to PascalCase. For example, `"icon-a"` becomes `"IconA"`.

### Icons

Your icons should follow the same format as your [default app icon](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/#export-the-icon-image-as-a-png).

- Use a **.png** file
- Square format with resolution **1024x1024 px**
- iOS
  - Without transparency layer
- Android - Adaptive icon
  - Foreground image
  - Background fill color

### API Documentation

#### Supports Alternate Icons

A boolean value indicating whether the current device supports alternate app icons.

```ts
const supportsAlternateIcons: boolean;
```

#### Set Alternate App Icon

To set app icon to **IconA**, use `setAlternateAppIcon("IconA")`. This function takes icon name as argument.

To reset the app icon to the default pass `null` like `setAlternateAppIcon(null)`.

```ts
function setAlternateAppIcon(name: string | null): Promise<string | null>;
```

#### Get App Icon Name

Retrieves the name of the currently active app icon.

```ts
function getAppIconName(): string | null;
```

#### Reset App Icon

Reset app icon to the default one.

> This is just a shortcut for `setAlternateAppIcon(null)`.

```ts
function resetAppIcon(): Promise<void>;
```

## Development

### Expo Config Plugin

```shell
yarn run build plugin # Start build on save
cd example && yarn expo prebuild # Execute the config plugin
```
