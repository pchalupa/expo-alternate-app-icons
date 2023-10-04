# Expo Alternate App Icons

Expo Alternate App Icons is a library that allows you to easily switch between different app icons in your Expo project.

## Introduction

Customizing app icons can be a valuable way to provide users with a personalized experience for your app. This library simplifies the process of implementing alternate app icons in your Expo project.

<p align="center">
	<img src="https://github.com/pchalupa/readme-assets/blob/main/expo-alternate-app-icons.gif" alt="demo" width="75%" />
</p>

## Installation

To get started, install the library using Expo CLI:

```sh
expo install expo-alternate-app-icons
```

## How To Use

Add `expo-alternate-app-icons` to the plugins array inside your [app.json](https://docs.expo.dev/versions/latest/config/app/). The second argument should be an array containing paths to your alternate icons.

> Your icons should have dimensions of 1024x1024 pixels in PNG format and without a transparency layer.

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

### API Documentation

#### Set Alternate App Icon

To set app icon to **icon-a.png**, use `setAlternateAppIcon("icon-a")`. Function takes exact icon name without suffix.

To reset the app icon to the default pass `null` like `setAlternateAppIcon(null)`.

```ts
function setAlternateAppIcon(name: string | null): Promise<string>;
```

#### Get App Icon Name

Retrieves the name of the currently active app icon.

```ts
function getAppIconName(): string;
```

#### Supports Alternate Icons

A boolean value indicating whether the current device supports alternate app icons.

```ts
const supportsAlternateIcons: boolean;
```
