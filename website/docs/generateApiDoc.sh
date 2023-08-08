#!/bin/bash

# List of flashlight commands
commands=("test")

# Get the directory where the script is located
script_dir=$(dirname "$(realpath "$0")")

for command in "${commands[@]}"
do
  # Set the output file path relative to the script directory
  output_file="$script_dir/$command/api.md"

  # Clear output file content if it already exists
  [ -f "$output_file" ] && > "$output_file"

  output=$(flashlight $command --help)

  if [ -n "$output" ]; then
    # Replace '>' with '\>' to prevent option parameters from being considered as HTML tags
    modified_output=$(echo "$output" | sed 's/>/\\>/g')

    description=$(echo "$modified_output" | sed -n '2,/^Options:/p' | sed '$d')
    options=$(echo "$modified_output" | awk '/Options:/{flag=1; next} /^$/{flag=0} flag')

    echo "# API" >> "$output_file"
    echo "" >> "$output_file"

    echo "## \`flashlight $command\`" >> "$output_file"
    echo "$description" >> "$output_file"

    echo "" >> "$output_file"
    echo "## Options" >> "$output_file"
    echo "" >> "$output_file"
    echo "| Option | Description |" >> "$output_file"
    echo "| --- | --- |" >> "$output_file"

    echo "$options" | while read -r line; do
      # Extract the option part by removing everything after the first occurrence of "  "
      option=$(echo "$line" | awk -F '  ' '{print $1}')
      
      description=$(echo "$line" | sed 's/.*  //')
      
      echo "| $option | $description |" >> "$output_file"
    done
    echo "$output_file is updated"
  else
    echo "Error: No output received. Please check if the 'flashlight' command is working correctly."
  fi

done
