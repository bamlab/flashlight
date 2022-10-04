#ifndef MEMINFO_H
#define MEMINFO_H

#include <string>

/**
 * Serves as in memory buffer for atrace lines
 *
 * pollMeminfo continually reads from adb shell dumpsys meminfo
 * to not pollute the main thread since it takes a long time
 *
 * it stores current value to be retrievable via
 * getCurrentMeminfoResult
 */
std::string getCurrentMeminfoResult();
void pollMeminfo(std::string bundleId);

#endif /* MEMINFO_H */
