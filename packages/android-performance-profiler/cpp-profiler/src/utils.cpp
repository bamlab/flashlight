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
  const auto p1 = std::chrono::system_clock::now();

  cout << "Timestamp: "
       << std::chrono::duration_cast<std::chrono::milliseconds>(
              p1.time_since_epoch())
              .count()
       << endl;
}
