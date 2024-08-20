---
sidebar_position: 30
---

# Setting up a project

:::info
The project feature is not yet available to the public. If you're interested in that feature, do reach out!
:::

## Creating a project

1. In the top-right menu, click on "Projects", then "+" to create one.

<img width="214" alt="image" src="https://github.com/user-attachments/assets/b78df07a-1aac-4897-b7bd-557ef60bad90" />

2. All the user emails you're adding need to have created an account prior to adding them (you can always add them later)

3. Your project should be created, you can find the **project id** which will be useful

## Adding tests

### Adding a startup scenario

:::warning
As of now, only the email registered to the API key will receive the report by email.
Adding Slack/Discord reporter would also be a nice idea in the future.
:::

In your [CI](./ci.md), you can start by having Flashlight get your startup score

```bash
flashlight cloud --test start.yaml --app app.apk \
 --projectId <PROJECT_ID> \
 --scoring APP_START \
 --testName "STARTUP"
```

**Explanation**:

- Setting the `projectId` will make the test appear as part of your project page `https://app.flashlight.dev/projects/<PROJECT_ID>/test-list`.
- Adding `--scoring APP_START` changes the method of scoring to take into account the test run time
- Adding `--testName STARTUP` makes your type of test identifiable so that you can check its metrics evolution on the evolution dashboard

### Adding other scenarios

New scenarios should also get identified with a different `testName` and need to pass their own `duration`.  
Flashlight will only measure performance for `duration` (in ms), this helps ensuring consistent measures, but this parameter can be annoying to set. Ideally, it should be always be slightly longer than the duration of your tests.

Your CI script could look something like:

```bash
PROJECT_ID=<PROJECT_ID>

# Startup score
flashlight cloud --beforeAll login.yaml --test start.yaml --app app.apk \
 --projectId $PROJECT_ID \
 --scoring APP_START \
 --testName "start"

# Another scenario
flashlight cloud --beforeAll login.yaml --test critical_path_1.yaml --app app.apk \
 --projectId $PROJECT_ID \
 --testName critical_path_1

# And another scenario
flashlight cloud --test login.yaml --app app.apk \
 --projectId $PROJECT_ID \
 --testName login
```
