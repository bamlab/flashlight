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

// This should be run from the main thread
void clearATraceLines()
{
  // Mutex between addToATraceLines and printATraceLines
  std::lock_guard<std::mutex> guard(aTraceLinesMutex);
  aTraceLines.clear();
}

bool includes(std::string str, std::string portion)
{
  return str.find(portion) != std::string::npos;
}

std::ifstream getTraceStream()
{
  std::string traceOutputPath1 = "/sys/kernel/debug/tracing/trace_pipe";
  // This seems to be an alternative path for certain devices
  std::string traceOutputPath2 = "/sys/kernel/tracing/trace_pipe";

  std::ifstream traceFile1(traceOutputPath1);

  if (traceFile1.is_open())
  {
    return traceFile1;
  }

  traceFile1.close();

  std::ifstream traceFile2(traceOutputPath2);
  if (traceFile2.is_open())
  {
    return traceFile2;
  }

  throw std::runtime_error("Unable to find Atrace output file");
}

void readATrace()
{
  std::ifstream traceFile = getTraceStream();

  while (traceFile.good())
  {
    std::string line;
    std::getline(traceFile, line);
    addToATraceLines(line);
  }
  traceFile.close();
}

void readATraceThread()
{
  readATrace();
}
