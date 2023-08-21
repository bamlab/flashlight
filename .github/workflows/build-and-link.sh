#!/bin/bash

set -e

yarn tsc --build
yarn workspace @perf-profiler/web-reporter build
npx link-lerna-package-binaries
