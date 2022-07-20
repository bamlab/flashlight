import { getPidId } from "@perf-profiler/profiler";
import { useMemo } from "react";
import { useDebounce } from "use-debounce";

export const usePidId = (bundleId: string | null) => {
  const pid = useMemo(() => {
    if (!bundleId) return null;

    try {
      return getPidId(bundleId);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error has occurred"
      );
      return null;
    }
  }, [bundleId]);

  const [pidDebounced] = useDebounce(pid, 1000);

  return pidDebounced === pid ? pid : null;
};
