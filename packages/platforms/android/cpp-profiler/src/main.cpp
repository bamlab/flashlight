#include <string>
#include <array>
#include <iostream>
#include <filesystem>
#include "atrace.h"
#include <fstream>
#include <thread>
#include <unistd.h>
#include "utils.h"
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <iostream>
#include <vector>
#include <sys/inotify.h>

using std::cerr;
using std::cout;
using std::endl;
using std::string;

namespace fs = std::filesystem;

void extractPidAndName(const std::string &line, std::string &pid, std::string &processName)
{
    size_t startPos = 0;
    size_t endPos = line.find(' ');
    if (endPos == std::string::npos)
    {
        throw std::runtime_error("Invalid line format: no space found.");
    }
    pid = line.substr(startPos, endPos - startPos);

    startPos = line.find('(', endPos);
    endPos = line.find(')', startPos);
    // if (startPos == std::string::npos || endPos == std::string::npos)
    // {
    //     throw std::runtime_error("Invalid line format: parentheses not found.");
    // }
    // +1 and -1 to exclude the parentheses themselves
    processName = line.substr(startPos + 1, endPos - startPos - 1);
}

class Timer
{
private:
    std::chrono::time_point<std::chrono::system_clock> start;

public:
    Timer()
    {
        start = std::chrono::system_clock::now();
    }

    long long elapsed()
    {
        auto end = std::chrono::system_clock::now();
        return std::chrono::duration_cast<std::chrono::microseconds>(end - start).count();
    }
};

std::ifstream file("/proc/8408/task/8408/stat");

void readFile(string filePath)
{

    if (file.is_open())
    {
        file.seekg(0, std::ios::beg);
        string line;
        std::getline(file, line);
        // log(line.c_str());

        auto timing = std::chrono::system_clock::now();

        std::string pid, processName;
        extractPidAndName(line, pid, processName);

        auto end = std::chrono::system_clock::now();

        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - timing);
        // cout << pid << " " << processName << endl;
        // file.close();
    }
    else
    {
        cerr << "CPP_ERROR_CANNOT_OPEN_FILE " + filePath << endl;
    }
}

class PidClosedError : public std::runtime_error
{
public:
    PidClosedError(const std::string &message)
        : std::runtime_error(message) {}
};

void readFilesInDir(const std::string &path)
{
    DIR *dirp = opendir(path.c_str());
    struct dirent *dp;
    while ((dp = readdir(dirp)) != nullptr)
    {
        if (dp->d_type == DT_REG)
        { // Check if it's a regular file
            std::string filePath = path + "/" + dp->d_name;
            int fd = open(filePath.c_str(), O_RDONLY);
            if (fd != -1)
            {
                // Read file content using read() into a buffer
                // Process the content
                close(fd);
            }
        }
    }
    closedir(dirp);
}

void printCpuStats(string pid)
{
    string path = "/proc/" + pid + "/task";

    // if (!fs::exists(path))
    // {
    //     throw PidClosedError("Directory does not exist: " + path);
    // }

    // for (const auto &entry : fs::directory_iterator(path))
    // {
    //     // string subProcessPath = entry.path().string() + "/stat";
    //     // readFile(subProcessPath);
    // }

    readFilesInDir(path);
}

void printMemoryStats(string pid)
{
    string memoryFilePath = "/proc/" + pid + "/statm";
    readFile(memoryFilePath);
}

long long printPerformanceMeasure(string pid)
{
    auto start = std::chrono::system_clock::now();

    readFile("/proc/8408/task/8408/stat");

    // string separator = "=SEPARATOR=";
    // log("=START MEASURE=");
    // log(pid);
    // log(separator);
    // printCpuStats(pid);
    // auto cpuEnd = std::chrono::system_clock::now();
    // log(separator);
    // printMemoryStats(pid);
    // auto memoryEnd = std::chrono::system_clock::now();
    // log(separator);
    // // TODO handle ATrace not available on OS
    // printATraceLines();
    // auto atraceEnd = std::chrono::system_clock::now();
    // log(separator);

    // logTimestamp();

    auto end = std::chrono::system_clock::now();

    // auto cpuDuration = std::chrono::duration_cast<std::chrono::microseconds>(cpuEnd - start);
    // auto memoryDuration = std::chrono::duration_cast<std::chrono::milliseconds>(memoryEnd - cpuEnd);
    // auto atraceDuration = std::chrono::duration_cast<std::chrono::milliseconds>(atraceEnd - memoryEnd);
    auto totalDuration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);

    cout << "TOTAL EXEC TIME: " << totalDuration.count() << "|" << endl;
    // cout << "CPU TIME: " << cpuDuration.count() << "|";
    // cout << "MEMORY TIME: " << memoryDuration.count() << "|";
    // cout << "ATRACE TIME: " << atraceDuration.count() << endl;

    // log("=STOP MEASURE=");

    return totalDuration.count();
}

std::string pidOf(string bundleId)
{
    auto result = executeCommand("pidof " + bundleId);
    return result.substr(0, result.find_first_of("\n"));
}

void pollPerformanceMeasures(std::string bundleId, int interval)
{
    string pid = "";

    // We read atrace lines before the app is started
    // since it can take a bit of time to start and clear the traceOutputPath
    // but we'll clear them out periodically while the app isn't started
    // TODO handle ATrace not available on OS
    std::thread aTraceReadThread(readATraceThread);

    cout << "Waiting for process to start..." << endl;

    while (pid == "")
    {
        clearATraceLines();
        pid = pidOf(bundleId);
        std::this_thread::sleep_for(std::chrono::milliseconds(50));
    }

    cout << "Process started: " << pid << endl;

    try
    {
        while (true)
        {
            auto duration = printPerformanceMeasure(pid);
            std::this_thread::sleep_for(std::chrono::milliseconds(interval - duration));
        }
    }
    catch (const PidClosedError &e)
    {
        cerr << "CPP_ERROR_MAIN_PID_CLOSED " + pid << endl;
        pollPerformanceMeasures(bundleId, interval);
        return;
    }
    // TODO handle ATrace not available on OS
    aTraceReadThread.join();
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
        string bundleId = argv[2];
        int interval = std::stoi(argv[3]);

        pollPerformanceMeasures(bundleId, interval);
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
