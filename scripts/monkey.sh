#!/usr/bin/env bash

BUNDLE_ID=$1
EVENT_COUNT=$2

adb shell monkey -p $BUNDLE_ID -v --pct-majornav 0 --pct-nav 0  --pct-trackball 0 --pct-anyevent 0 --pct-syskeys 0 --pct-appswitch 0 --pct-touch 100 --pct-motion 0 $EVENT_COUNT
