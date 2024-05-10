#include <string>
#include <array>
#include <iostream>
#include <filesystem>
#include "atrace.h"
#include <fstream>
#include <thread>
#include <unistd.h>
#include "utils.h"

using std::cerr;
using std::cout;
using std::string;

namespace fs = std::filesystem;

#define BUFFER_SIZE 2048

auto readFile(std::string_view path)
{
    constexpr auto read_size = std::size_t(BUFFER_SIZE);
    auto stream = std::ifstream(path.data());
    stream.exceptions(std::ios_base::badbit);

    if (not stream)
    {
        cerr << "CPP_ERROR_CANNOT_OPEN_FILE " << path << "\n";
        return;
    }

    auto out = std::string();
    auto buf = std::string(read_size, '\0');
    while (stream.read(&buf[0], read_size))
    {
        out.append(buf, 0, stream.gcount());
    }
    out.append(buf, 0, stream.gcount());

    log(out);
}

class PidClosedError : public std::runtime_error
{
public:
    PidClosedError(const std::string &message)
        : std::runtime_error(message) {}
};

void printCpuStats(std::vector<string> pids)
{
    for (string pid : pids)
    {
        string path = "/proc/" + pid + "/task";

        if (!fs::exists(path))
        {
            throw PidClosedError("Directory does not exist: " + path);
        }

        for (const auto &entry : fs::directory_iterator(path))
        {
            string subProcessPath = entry.path().string() + "/stat";
            readFile(subProcessPath);
        }
    }
}

void printMemoryStats(std::vector<string> pids)
{
    for (string pid : pids)
    {
        string memoryFilePath = "/proc/" + pid + "/statm";
        readFile(memoryFilePath);
    }
}

long long totalDurationSum = 0;
long long measureCount = 0;

long long printPerformanceMeasure(std::vector<string> pids)
{
    auto start = std::chrono::system_clock::now();

    string separator = "=SEPARATOR=";
    log("=START MEASURE=");
    // Log the first pid as the main pid
    log(pids[0]);
    log(separator);
    printCpuStats(pids);
    auto cpuEnd = std::chrono::system_clock::now();
    log(separator);
    printMemoryStats(pids);
    auto memoryEnd = std::chrono::system_clock::now();
    log(separator);
    // TODO handle ATrace not available on OS
    printATraceLines();
    auto atraceEnd = std::chrono::system_clock::now();
    log(separator);

    logTimestamp();

    auto end = std::chrono::system_clock::now();

    auto cpuDuration = std::chrono::duration_cast<std::chrono::milliseconds>(cpuEnd - start);
    auto memoryDuration = std::chrono::duration_cast<std::chrono::milliseconds>(memoryEnd - cpuEnd);
    auto atraceDuration = std::chrono::duration_cast<std::chrono::milliseconds>(atraceEnd - memoryEnd);
    auto totalDuration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);

    long long totalDurationMs = totalDuration.count();

    cout << "TOTAL EXEC TIME: " << totalDuration.count() << "|";
    cout << "CPU TIME: " << cpuDuration.count() << "|";
    cout << "MEMORY TIME: " << memoryDuration.count() << "|";
    cout << "ATRACE TIME: " << atraceDuration.count() << "\n";

    measureCount++;
    totalDurationSum += totalDurationMs;

    log(separator);
    cout << "AVERAGE TOTAL EXEC TIME: " << totalDurationSum / measureCount << "\n";

    log("=STOP MEASURE=");

    cout << std::flush;

    return totalDuration.count();
}

std::vector<string> pidOf(string bundleId)
{
    auto result = executeCommand("pidof " + bundleId);
    return split(result, ' ');
}

void pollPerformanceMeasures(std::string bundleId, int interval)
{
    std::vector<string> pids;

    // We read atrace lines before the app is started
    // since it can take a bit of time to start and clear the traceOutputPath
    // but we'll clear them out periodically while the app isn't started
    // TODO handle ATrace not available on OS
    std::thread aTraceReadThread(readATraceThread);

    cout << "Waiting for process to start..."
         << "\n";

    while (pids.empty())
    {
        clearATraceLines();
        pids = pidOf(bundleId);
        std::this_thread::sleep_for(std::chrono::milliseconds(50));
    }

    try
    {
        while (true)
        {
            auto duration = printPerformanceMeasure(pids);
            std::this_thread::sleep_for(std::chrono::milliseconds(interval - duration));
        }
    }
    catch (const PidClosedError &e)
    {
        cerr << "CPP_ERROR_MAIN_PID_CLOSED " << e.what() << "\n";
        pollPerformanceMeasures(bundleId, interval);
        return;
    }
    // TODO handle ATrace not available on OS
    aTraceReadThread.join();
}

void printCpuClockTick()
{
    cout << sysconf(_SC_CLK_TCK) << "\n";
}

void printRAMPageSize()
{
    cout << sysconf(_SC_PAGESIZE) << "\n";
}

int main(int argc, char **argv)
{
    string methodName = argv[1];

    if (methodName == "pollPerformanceMeasures")
    {
        string bundleId = argv[2];
        int interval = std::stoi(argv[3]);

        pollPerformanceMeasures(bundleId, interval);
    }
    else if (methodName == "printPerformanceMeasure")
    {
        std::vector<string> pids;
        pids.push_back(argv[2]);
        printPerformanceMeasure(pids);
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
        cout << "Unknown method name: " << methodName << "\n";
        return 1;
    }

    return 0;
}
