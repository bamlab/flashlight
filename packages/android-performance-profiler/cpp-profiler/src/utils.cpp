#include "utils.h"
#include <iostream>

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
