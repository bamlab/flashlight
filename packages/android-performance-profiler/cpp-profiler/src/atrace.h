#ifndef A_TRACE_H
#define A_TRACE_H

#include <string>

/**
 * Serves as in memory buffer for atrace lines
 *
 * readATraceThread continually reads the atrace pipe
 * and stores relevant lines in a list
 *
 * printATraceLines can be called in our polling to pop the lines
 * stored and output them for the computer to consume
 */
void printATraceLines();
void readATraceThread();
void clearATraceLines();

#endif /* A_TRACE_H */
