#include "utils.h"
#include <iostream>
#include <array>
#include <memory>
#include <chrono>

using std::cout;

void log(const std::string &msg)
{
  cout << msg << "\n";
}

void logTimestamp()
{
  const auto now = std::chrono::system_clock::now();
  const auto timestamp = std::chrono::duration_cast<std::chrono::milliseconds>(
                             now.time_since_epoch())
                             .count();

  cout << "Timestamp: " << timestamp << "\n";
}

std::string executeCommand(std::string command)
{
  std::array<char, 128> buffer;
  std::string result;
  std::unique_ptr<FILE, decltype(&pclose)> pipe(popen(command.c_str(), "r"), pclose);
  if (!pipe)
  {
    throw std::runtime_error("popen() failed!");
  }
  while (fgets(buffer.data(), buffer.size(), pipe.get()) != nullptr)
  {
    result += buffer.data();
  }
  return result;
}

std::vector<std::string> split(const std::string &str, char delimiter)
{
  std::vector<std::string> result;
  std::string currentResult = "";
  for (char c : str)
  {
    if (c == delimiter || c == '\n')
    {
      result.push_back(currentResult);
      currentResult = "";
    }
    else
    {
      currentResult += c;
    }
  }

  return result;
}
