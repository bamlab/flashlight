---
sidebar_position: 1
---

# Getting started

## Installation

Install the CLI with:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

<Tabs>
  <TabItem value="unix" label="macOS/Linux" default>
    <CodeBlock language="bash">
      curl https://get.flashlight.dev | bash
    </CodeBlock>
  </TabItem>
  <TabItem value="windows" label="Windows">
    <CodeBlock language="bash">
      iwr https://get.flashlight.dev/windows -useb | iex
    </CodeBlock>
  </TabItem>
</Tabs>

## Simple usage

🔌 Plug-in an Android device to your computer. Open any app.

Then the simplest way to get started is to run the `flashlight measure` command:

<video autoplay="" muted controls style={{width: "100%"}}>

  <source src="https://github.com/bamlab/flashlight/assets/4534323/4038a342-f145-4c3b-8cde-17949bf52612"/>
</video>

## Going further

You might have noticed that your performance score is completely dependent on how you use your app, and might change quite a bit.

Performance measures are usually not deterministic, one way to combat this is to:

- run several iterations and average results
- automate user behavior

But let's face it, that's just super cumbersome to do!  
Luckily we got you covered:  
[check out the test command](test) to do this automatically for you!
