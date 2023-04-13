---
sidebar_position: 3
---

# Integrate into CI

The easiest way to setup Flashlight on your CI is to add a script installing the CLI:

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
export PATH="$PATH":"$HOME/.maestro/bin"
```

Create your API key [here](https://app.flashlight.dev/api-key) and set it as a secret environment variable on your CI named `FLASHLIGHT_API_KEY`

Then use the `flashlight cloud` command (see [here for more details](./cli.md))
