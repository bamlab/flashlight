#include <string>
#include <iostream>
#include <filesystem>
#include <fstream>
#include <cstdio>
#include <memory>
#include <stdexcept>
#include <string>
#include <array>
#include <thread>
#include <unistd.h>

using std::cout;
using std::endl;
using std::string;
using namespace std::chrono;

namespace fs = std::__fs::filesystem;

void log(const string &msg)
{
    cout << msg << endl;
}

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
        cout << "OH NOOOO";
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

void printGfxInfoStats(string pid)
{
    system(("dumpsys gfxinfo " + pid).c_str());
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
    // Gfxinfo is the big bottleneck obviously (~80ms on J3), the rest is ~10ms
    printGfxInfoStats(pid);
    log(separator);

    const auto p1 = std::chrono::system_clock::now();

    cout << "Timestamp: "
         << std::chrono::duration_cast<std::chrono::milliseconds>(
                p1.time_since_epoch())
                .count()
         << '\n';

    auto end = std::chrono::system_clock::now();
    auto duration = duration_cast<milliseconds>(end - start);
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
        pollPerformanceMeasures(argv);
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
