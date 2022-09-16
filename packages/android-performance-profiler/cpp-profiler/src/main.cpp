#include <string>
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
        cout << "C++ Error, file couldn't be opened";
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
    printCpuStats(pid);
    log(separator);
    printMemoryStats(pid);
    log(separator);
    printATraceLines();
    log(separator);

    logTimestamp();

    auto end = std::chrono::system_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
    cout << "ADB EXEC TIME: " << duration.count() << endl;
    log("=STOP MEASURE=");

    return duration.count();
}

void pollPerformanceMeasures(char **argv)
{
    string pid = argv[2];
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

int main(int argc, char **argv)
{
    string methodName = argv[1];

    if (methodName == "pollPerformanceMeasures")
    {
        string pid = argv[2];

        std::thread aTraceReadThread(readATraceThread, pid);
        pollPerformanceMeasures(argv);
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
