---
sidebar_position: 1
---

# Getting started

## Installation

Install the CLI with:

```bash
curl https://get.flashlight.dev/ | bash
```

## Simple usage

🔌 Plug-in an Android device to your computer. Open any app.


Then the simplest way to get started is to [use our Flipper plugin](./flipper) or use the `measure` command:

#### 1. Run the measure command
```bash
flashlight measure
```
Do things in your app, then press `w`.  
A JSON file full of performance measures will be written for you.

#### 2. Open the web report
From this JSON file, you can generate a full web report with your performance score 
```bash
flashlight report <your results.json>
```

See more on how to customize reports, generate comparison views... [here](/category/-customize-reports) .

## Going further

You might have noticed that your performance score is completely dependent on how you use your app, and might change quite a bit.

Performance measures are usually not deterministic, the best way to combat this is to:
- run several iterations and average results
- automate user behavior


But let's face it, that's just super cumbersome to do!   
Luckily we got you covered:  
[check out the test command](./category/-automate-measures) to do this automatically for you!