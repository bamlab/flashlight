cmake_minimum_required(VERSION 3.16.0)
project(android-cmake-flashlight)
add_executable(BAMPerfProfiler src/main.cpp src/atrace.cpp src/utils.cpp)

set(CMAKE_CXX_STANDARD 21)
