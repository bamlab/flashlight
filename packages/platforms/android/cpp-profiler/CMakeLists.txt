cmake_minimum_required(VERSION 3.16.0)
project(android-cmake-flashlight)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(BAMPerfProfiler src/main.cpp src/atrace.cpp src/utils.cpp)

set_target_properties(BAMPerfProfiler PROPERTIES
    ANDROID_ABI armeabi-v7a  # or any other ABI like arm64-v8a, x86, x86_64
    ANDROID_PLATFORM android-30  # Minimum API level
    # Other properties as needed
)