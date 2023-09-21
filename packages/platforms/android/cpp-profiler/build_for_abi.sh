#!/usr/bin/env bash

ABI=$1

# A better config would be to have one build folder per architecture
rm -rf CMakeFiles CMakeCache.txt BAMPerfProfiler
cmake \
  -DCMAKE_TOOLCHAIN_FILE=$ANDROID_NDK/build/cmake/android.toolchain.cmake \
  -DANDROID_PLATFORM=android-23 \
  -DANDROID_ABI=$ABI \
  -DCMAKE_ANDROID_ARCH_ABI=$ABI
cmake --build .
