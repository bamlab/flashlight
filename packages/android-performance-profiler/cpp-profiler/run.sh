#!/usr/bin/env bash

cmake --build .
adb push BAMPerfProfiler /data/local/tmp/BAMPerfProfiler
adb shell /data/local/tmp/BAMPerfProfiler $1 $2
