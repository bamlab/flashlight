#!/usr/bin/env bash

for abi in armeabi-v7a arm64-v8a x86 x86_64
do
  echo "Building for $abi"
  ./build_for_abi.sh $abi
  mv BAMPerfProfiler bin/BAMPerfProfiler-$abi
done
