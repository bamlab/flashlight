import _ from "lodash";
import { detectCurrentAppBundleId } from "./commands/detectCurrentAppBundleId";
import { getPidId } from "./commands/getPidId";
import { pollPerformanceMeasures } from "./commands/pollPerformanceMeasures";
import {
  getAverageCpuUsage,
  getAverageCpuUsagePerProcess,
  getHighCpuUsageStats,
} from "./reporting/reporting";

export { Measure } from "./Measure";

export {
  detectCurrentAppBundleId,
  getPidId,
  pollPerformanceMeasures,
  getAverageCpuUsage,
  getAverageCpuUsagePerProcess,
  getHighCpuUsageStats,
};
