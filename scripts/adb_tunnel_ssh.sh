#!/usr/bin/env bash

function ssh_remote_server () {
  ssh -o StrictHostKeyChecking=no -p $SSH_PORT $SSH_USER@$SSH_HOST
}

function connect_remote_adb () {
  echo "Killing local server"
  adb kill-server
  sleep 3

  echo "Starting ADB port forwarding"
  # 5037 is for adb
  # 4723 is for Appium
  ssh -o StrictHostKeyChecking=no -fNT -L 5037:127.0.0.1:5037 -L 4723:127.0.0.1:4723 $SSH_USER@$SSH_HOST -p $SSH_PORT

  echo "Running adb devices on local machine"
  adb devices
}

function disconnect_remote_adb () {
  echo "Killing those SSH processes:"
  pgrep -f "ssh -o StrictHostKeyChecking=no -fNT"
  pgrep -f "ssh -o StrictHostKeyChecking=no -fNT" | xargs kill
  echo "Done"
}

function connect_scrcpy () {
  echo "Keep this tab open and run scrcpy in a separate tab"
  ssh -o StrictHostKeyChecking=no -CN -R27183:127.0.0.1:27183 $SSH_USER@$SSH_HOST -p $SSH_PORT
}
