#include "meminfo.h"
#include <array>
#include <iostream>

std::string exec(std::string cmd)
{
  std::array<char, 128> buffer;
  std::string result;

  auto pipe = popen(cmd.c_str(), "r"); // get rid of shared_ptr

  if (!pipe)
    throw std::runtime_error("popen() failed!");

  while (!feof(pipe))
  {
    if (fgets(buffer.data(), 128, pipe) != nullptr)
      result += buffer.data();
  }

  auto rc = pclose(pipe);

  if (rc == EXIT_SUCCESS)
  { // == 0
  }
  else if (rc == EXIT_FAILURE)
  { // EXIT_FAILURE is not used by all programs, maybe needs some adaptation.
  }
  return result;
}

std::string currentOutput;

std::string getCurrentMeminfoResult()
{
  return currentOutput;
}

void pollMeminfo(std::string bundleId)
{
  while (true)
  {

    auto start = std::chrono::system_clock::now();
    currentOutput = exec("dumpsys meminfo " + bundleId);
    auto end = std::chrono::system_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);
    std::cout << "MEMINFO EXEC TIME: " << duration.count() << std::endl;
  }
}
