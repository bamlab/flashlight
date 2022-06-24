import _ from "lodash";
import { detectCurrentAppBundleId } from "./commands/detectCurrentAppBundleId";
import { getPidId } from "./commands/getPidId";
import { pollPerformanceMeasures } from "./commands/pollPerformanceMeasures";
import {
  getAverageCpuUsage,
  getAverageCpuUsagePerProcess,
  getHighCpuUsageStats,
} from "./reporting/reporting";
import { parseGfxInfo } from "./commands/gfxInfo/parseGfxInfo";
import { compareGfxMeasures } from "./commands/gfxInfo/compareGfxMeasures";

export { Measure } from "./Measure";
export { Measure as GfxInfoMeasure } from "./commands/gfxInfo/parseGfxInfo";

export {
  compareGfxMeasures,
  detectCurrentAppBundleId,
  getPidId,
  pollPerformanceMeasures,
  getAverageCpuUsage,
  getAverageCpuUsagePerProcess,
  getHighCpuUsageStats,
  parseGfxInfo,
};
