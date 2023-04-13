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
