cmake_minimum_required(VERSION 3.22)
project(android-cmake-flashlight)

set(CMAKE_CXX_STANDARD 17)

add_executable(BAMPerfProfiler src/main.cpp src/atrace.cpp src/utils.cpp)

# Android 15+ devices can use 16 KB memory pages; a binary whose LOAD segments are only 4 KB-aligned
# segfaults there. NDK r28+ does this by default, this keeps older NDKs working too.
target_link_options(BAMPerfProfiler PRIVATE -Wl,-z,max-page-size=16384)
