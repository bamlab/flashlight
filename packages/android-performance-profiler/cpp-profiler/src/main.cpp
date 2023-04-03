#include <string>
#include <array>
#include <iostream>
#include <filesystem>
#include "atrace.h"
#include <fstream>
#include <thread>
#include <unistd.h>
#include "utils.h"

using std::cout;
using std::endl;
using std::string;

namespace fs = std::__fs::filesystem;

void readFile(string filePath)
{
    std::ifstream file(filePath);
    if (file.is_open())
    {
        string line;
        while (std::getline(file, line))
        {
            log(line.c_str());
        }
        file.close();
    }
    else
    {
        cout << "C++ Error, file couldn't be opened" << endl;
    }
}

void printCpuStats(string pid)
{
    string path = "/proc/" + pid + "/task";

    for (const auto &entry : fs::directory_iterator(path))
    {
        string subProcessPath = entry.path().string() + "/stat";
        readFile(subProcessPath);
    }
}

void printMemoryStats(string pid)
{
    string memoryFilePath = "/proc/" + pid + "/statm";
    readFile(memoryFilePath);
}

long long printPerformanceMeasure(string pid)
{
    auto start = std::chrono::system_clock::now();

    string separator = "=SEPARATOR=";
    log("=START MEASURE=");
    log(pid);
    log(separator);
    printCpuStats(pid);
    auto cpuEnd = std::chrono::system_clock::now();
    log(separator);
    printMemoryStats(pid);
    auto memoryEnd = std::chrono::system_clock::now();
    log(separator);
    printATraceLines();
    auto atraceEnd = std::chrono::system_clock::now();
    log(separator);

    logTimestamp();

    auto end = std::chrono::system_clock::now();

    auto cpuDuration = std::chrono::duration_cast<std::chrono::milliseconds>(cpuEnd - start);
    auto memoryDuration = std::chrono::duration_cast<std::chrono::milliseconds>(memoryEnd - cpuEnd);
    auto atraceDuration = std::chrono::duration_cast<std::chrono::milliseconds>(atraceEnd - memoryEnd);
    auto totalDuration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);

    cout << "TOTAL EXEC TIME: " << totalDuration.count() << "|";
    cout << "CPU TIME: " << cpuDuration.count() << "|";
    cout << "MEMORY TIME: " << memoryDuration.count() << "|";
    cout << "ATRACE TIME: " << atraceDuration.count() << endl;

    log("=STOP MEASURE=");

    return totalDuration.count();
}

void pollPerformanceMeasures(std::string pid)
{
    int interval = 500;

    while (true)
    {
        auto duration = printPerformanceMeasure(pid);
        std::this_thread::sleep_for(std::chrono::milliseconds(interval - duration));
    }
}

void printCpuClockTick()
{
    cout << sysconf(_SC_CLK_TCK) << endl;
}

void printRAMPageSize()
{
    cout << sysconf(_SC_PAGESIZE) << endl;
}

std::string pidOf(string bundleId)
{
    auto result = executeCommand("pidof " + bundleId);
    return result.substr(0, result.find_first_of("\n"));
}

int main(int argc, char **argv)
{
    string methodName = argv[1];

    if (methodName == "pollPerformanceMeasures")
    {
        string bundleId = argv[2];
        string pid = "";

        // We read atrace lines before the app is started
        // since it can take a bit of time to start and clear the traceOutputPath
        // but we'll clear them out periodically while the app isn't started
        std::thread aTraceReadThread(readATraceThread);

        cout << "Waiting for process to start..." << endl;

        while (pid == "")
        {
            clearATraceLines();
            pid = pidOf(bundleId);
            std::this_thread::sleep_for(std::chrono::milliseconds(50));
        }

        pollPerformanceMeasures(pid);
        aTraceReadThread.join();
    }
    else if (methodName == "printPerformanceMeasure")
    {
        printPerformanceMeasure(argv[2]);
    }
    else if (methodName == "printCpuClockTick")
    {
        printCpuClockTick();
    }
    else if (methodName == "printRAMPageSize")
    {
        printRAMPageSize();
    }
    else
    {
        cout << "Unknown method name: " << methodName << endl;
        return 1;
    }

    return 0;
}
