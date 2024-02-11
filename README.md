# Expo Alternate App Icons

Expo Alternate App Icons is a library that allows you to easily switch between different app icons in your Expo project.

### Platform Compatibility

| Android Device | Android Emulator | iOS Device | iOS Simulator | Web |
| -------------- | ---------------- | ---------- | ------------- | --- |
| ❌             | ❌               | ✅         | ✅            | ❌  |

## Introduction

Customizing app icons can be a valuable way to provide users with a personalized experience for your app. This library simplifies the process of implementing alternate app icons in your Expo project.

### Demo

<p align="center">
	<img src="https://github.com/pchalupa/readme-assets/blob/main/expo-alternate-app-icons.gif" alt="demo" width="75%" />
</p>

## Installation

To get started, install the library using Expo CLI:

```sh
expo install expo-alternate-app-icons
```

## How To Use

This package contains an Expo Plugin that copies your alternative icons to the Xcode project.

1. Add `expo-alternate-app-icons` to the plugins array inside your [app.json](https://docs.expo.dev/versions/latest/config/app/).
2. The second item in the array accepts an array with paths to your alternate icons.

```json5
// app.json
{
  // ...
  plugins: [
    // ...
    [
      'expo-alternate-app-icons', // add "expo-alternate-app-icons" to the plugins array
      ['./assets/icon-a.png', './assets/icon-b.png', './assets/icon-c.png'], // array with paths to the icons
    ],
  ],
}
```

### Icons

Your icons should follow the same format as your [default app icon](https://docs.expo.dev/develop/user-interface/app-icons/#ios).

- Use a **.png** file.
- Square format with resolution **1024x1024 px**.
- Without transparency layer.

### API Documentation

#### Supports Alternate Icons

A boolean value indicating whether the current device supports alternate app icons.

```ts
const supportsAlternateIcons: boolean;
```

#### Set Alternate App Icon

To set app icon to **icon-a.png**, use `setAlternateAppIcon("icon-a")`. This function takes exact icon name without suffix.

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

To reset app icon to the default one.

```ts
function resetAppIcon(): Promise<void>;
```
