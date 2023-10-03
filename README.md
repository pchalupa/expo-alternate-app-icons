# Expo Alternate App Icons

Provides an interface for alternate the app icon.

## Installation

```sh
expo install expo-alternate-app-icons
```

## How To Use

Add `expo-alternate-app-icons` into the plugins array inside your app.json. The second argument is an array with paths to the icons.

> Your icons should be **1024x1024** format without transparency layer.

```json
// app.json
{
  // ...
  "plugins": [
    // ...
    [
      "expo-alternate-app-icons", // add "expo-alternate-app-icons" to the plugins array
      ["./assets/icon-a.png", "./assets/icon-b.png", "./assets/icon-c.png"] // array with paths to the icons
    ]
  ]
}
```

### API Documentation

#### Set Alternate App Icon

To set alternate icon to **icon-a** use `setAlternateAppIcon("icon-a")`. To reset the app icon to the default one use `setAlternateAppIcon(null)`.

```ts
function setAlternateAppIcon(name: string | null): Promise<string>;
```

#### Get App Icon Name

Returns current app icon name.

```ts
function getAppIconName(): string;
```

#### Supports Alternate Icons

Indicates if current device supports alternate icons.

```ts
const supportsAlternateIcons: boolean;
```
