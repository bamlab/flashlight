#include "utils.h"
#include <iostream>
#include <array>

using std::cout;
using std::endl;

void log(const std::string &msg)
{
  cout << msg << endl;
}

void logTimestamp()
{
  const auto now = std::chrono::system_clock::now();
  const auto timestamp = std::chrono::duration_cast<std::chrono::milliseconds>(
                             now.time_since_epoch())
                             .count();

  cout << "Timestamp: " << timestamp << endl;
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
