import { FrameTimeParser } from "./pollFpsUsage";
import fs from "fs"

const parser = new FrameTimeParser()

const result = parser.getFrameTimes(fs.readFileSync("/Users/louisdachet/Developer/Perso/flashlight/packages/android-performance-profiler/src/commands/atrace/trace.txt").toString(), "1234")

console.log({
    fps: result.frameTimes.length / result.interval * 1000,
    interval:  result.interval
}) 
console.log(result.frameTimes)