import { getPidId } from "android-performance-profiler";
import { useMemo } from "react";
import { useDebounce } from "use-debounce";

export const usePidId = (bundleId: string | null) => {
  const pidId = useMemo(() => {
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

  const [pidIdDebounced] = useDebounce(pidId, 1000);

  return pidIdDebounced === pidId ? pidId : null;
};
