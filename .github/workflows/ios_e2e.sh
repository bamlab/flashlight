#!/bin/bash

# Get the UDID of an iPhone 11 simulator
UDID=$(xcrun simctl list devices | grep -m 1 'iPhone 14 (' | awk -F '[()]' '{print $2}')

# Boot the simulator
xcrun simctl boot $UDID

# Echo the UDID (for further use)
echo $UDID