# script that get args from a yml file : appId, simulatorId, pathToApp, pathToProject and run the tests
# Usage: ./run_all_tests.sh <path_to_yml_file>
# Example: ./run_all_tests.sh ios_test.yml


# Get the appId from the yml file
app_id=com.contentsquare.reactnative.typescript.dev

# Get the simulatorId from the yml file
# xcrun xctrace list devices
simulator_id=9F852910-03AD-495A-8E16-7356B764284

start_record() {
    xcrun xctrace record --device $1 --template Flashlight --attach 'fakeStore' --output $2 &
}

save() {
    output_file=report
    mkdir -p ./report

    echo "Trace $1 saved in ./report/$output_file.xml"

    xctrace export --input $1 --xpath '/trace-toc/run[@number="1"]/data/table[@schema="cpu-profile"]' --output ./report/$output_file.xml
    # TODO: use TS
    node dist/xml.js ./report/$output_file.xml ./report.json
}

launch_test() {

    app_id=$1
    simulator_id=$2

    echo "app_id : $app_id"
    echo "simulator_id : $simulator_id"

    trace_file="report_$(date +%Y%m%d%H%M%S).trace"

    maestro test launch.yaml --no-ansi
    start_record $simulator_id $trace_file
    maestro test test.yaml --no-ansi
    # TODO : check if need to wait for the test to finish
    sleep 5
    # Needed because start_record is a background process
    wait
    save $trace_file
}

launch_test $app_id $simulator_id
