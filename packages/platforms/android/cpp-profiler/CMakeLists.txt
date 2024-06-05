cmake_minimum_required(VERSION 3.22)
project(android-cmake-flashlight)

set(CMAKE_CXX_STANDARD 17)

add_executable(BAMPerfProfiler src/main.cpp src/atrace.cpp src/utils.cpp)
