---
sidebar_position: 3
---

# Integrate into CI

The easiest way to setup Flashlight on your CI is to add a script installing the CLI:

```bash
curl https://get.flashlight.dev/ | bash
export PATH="$HOME/.flashlight/bin:$PATH"
```

Create your API key [here](https://app.flashlight.dev/api-key) and set it as a secret environment variable on your CI named `FLASHLIGHT_API_KEY`

Then use the `flashlight cloud` command (see [here for more details](./cli.md)):

```bash
flashlight cloud --app your/path/example.apk --test start.yml --apiKey $FLASHLIGHT_API_KEY
```

## Examples of CI integrations

### Using EAS (React Native)

#### Basic usage

1. Create a `eas-build-on-success.sh` file with the following content:

```bash
if [ "$EAS_BUILD_PROFILE" = "e2e" ] && [ "$EAS_BUILD_PLATFORM" = "android" ]; then
    curl https://get.flashlight.dev/ | bash
    export PATH="$HOME/.flashlight/bin:$PATH"

    flashlight cloud --app android/app/build/outputs/apk/release/app-release.apk --test e2e/test.yml --apiKey $FLASHLIGHT_API_KEY
    # Or android/app/build/outputs/bundle/release/app-release.aab if you are using an aab
fi
```

Notes:

- `EAS_BUILD_PROFILE` is an environment variable set by EAS. You should specify the name of the profile used to build your app that is compatible with Flashlight. In the example above, we use the `e2e` profile that set the following:

```json
{
    ...
    "build": {
        ...
        "e2e": {
            "developmentClient": false,
            "distribution": "internal",
            ...
        }
    }
}
```

- `EAS_BUILD_PLATFORM` is an environment variable set by EAS. You should specify the platform used to build your app that is compatible with Flashlight. For now, only Android is supported.

2. Give the script execution permissions:

```bash
chmod +x eas-build-on-success.sh
```

3. Then add in your `package.json`:

```json
{
    ...
    "scripts": {
        ...
        "eas-build-on-success": "./eas-hooks/eas-build-on-success.sh"
    }
}
```

✅ Check:

- Now, your builds should be automatically uploaded to Flashlight when they are successfuly completed on EAS with the selected profile.

#### Advanced usage - use flashlight on production builds

If you want to use Flashlight on production builds, you can extend the `eas-build-on-success.sh` script to upload the production build to Flashlight.

Here's an example of script that does all of that:

```bash
if [ "$EAS_BUILD_PROFILE" = "production" ] && [ "$EAS_BUILD_PLATFORM" = "android" ]; then
  curl https://get.flashlight.dev/ | bash
  export PATH="$HOME/.flashlight/bin:$PATH"
  flashlight cloud --app android/app/build/outputs/bundle/release/app-release.aab --test e2e/test.yml --apiKey $FLASHLIGHT_API_KEY
fi
```
