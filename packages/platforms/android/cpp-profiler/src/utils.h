#ifndef UTILS_H
#define UTILS_H

#include <string>

void log(const std::string &msg);
void logTimestamp();
std::string executeCommand(std::string command);
std::vector<std::string> split(const std::string &str, char delimiter);

#endif /* UTILS_H */
