#include "atrace.h"
#include "utils.h"

#include <mutex>
#include <list>
#include <iostream>
#include <fstream>
#include <thread>

std::list<std::string> aTraceLines;
std::mutex aTraceLinesMutex;

// This will be run from a separate thread
void addToATraceLines(std::string line)
{
  // Mutex between addToATraceLines and printATraceLines
  std::lock_guard<std::mutex>
      guard(aTraceLinesMutex);
  aTraceLines.push_back(line);
}

// This should be run from the main thread
void printATraceLines()
{
  // Mutex between addToATraceLines and printATraceLines
  std::lock_guard<std::mutex> guard(aTraceLinesMutex);
  for (auto itr = aTraceLines.begin(), end_itr = aTraceLines.end(); itr != end_itr; ++itr)
  {
    std::cout << *itr << std::endl;
  }
  aTraceLines.clear();
}

bool includes(std::string str, std::string portion)
{
  return str.find(portion) != std::string::npos;
}

void readATrace(std::string pid)
{
  std::string traceOutputPath = "/sys/kernel/debug/tracing/trace_pipe";

  std::ifstream traceFile(traceOutputPath);
  if (traceFile.is_open())
  {
    while (traceFile.good())
    {
      std::string line;
      std::getline(traceFile, line);
      addToATraceLines(line);
    }
    traceFile.close();
  }
  else
  {
    std::cout << "Unable to open file";
  }
}

void readATraceThread(std::string pid)
{
  readATrace(pid);
}
