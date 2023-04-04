---
sidebar_position: 2
---

# Run via CLI

:::info
Flashlight Cloud supports only Maestro for now, if you wish to have support for more testing frameworks, reach out on Slack or via mail
:::

## Usage

Create your API key [here](https://app.flashlight.dev/api-key) and set it as an environment variable:

```bash
export FLASHLIGHT_API_KEY="fl_xxxxx"
```

Create your Maestro test file, for instance `start.yml`:

```yml
appId: com.example
---
- launchApp
- assertVisible: A text on your app
```

Then run:

```bash
flashlight cloud --app example.apk --test start.yml --duration 10000
```

:::tip 
We'll soon support .aab files via the CLI
:::

## Run before measuring (log in/accept cookies...)

You might need to run some custom things before measuring performance, for instance accepting cookies or logging in. 

Create a new Maestro test file, for instance `beforeAll.yml`:

```yml
appId: com.example
---
- launchApp
- tapOn: "Accept cookies"
# Login
- tapOn: "Username"
- inputText: "myappisawesome@flashlight.dev"
- tapOn: "Password"
- inputText: "Very Secure Password"
- tapOn: "Log in"
# Ensure login has happened before closing app
- assertVisible: "Welcome back"
```

Now run:

```bash
flashlight cloud --app example.apk \
  --test start.yml \
  --duration 10000 \
  --beforeAll beforeAll.yml
```

The `beforeAll` test will only be run once and won't be included in performance measures.
