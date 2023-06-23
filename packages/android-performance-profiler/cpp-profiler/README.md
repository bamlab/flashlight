# C++ Profiler

## Release

To build all executable in bin folder, run:

```sh
./build_all_abi.sh
```

## Run locally

Build for your device architecture first:

```sh
./build_for_abi.sh $(adb shell getprop ro.product.cpu.abi)
```

then you can run with:

```sh
./run.sh [command] <arguments>
# For instance
./run.sh pollPerformanceMeasures $(adb shell pidof com.example)
```
