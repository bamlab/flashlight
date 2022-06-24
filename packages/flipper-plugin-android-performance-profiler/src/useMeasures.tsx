import { Measure, pollPerformanceMeasures } from "android-performance-profiler";
import { useRef, useState } from "react";

export const useMeasures = (pid: string | null) => {
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measures, setMeasures] = useState<Measure[]>([]);
  const measuresRef = useRef<Measure[]>([]);
  const poll = useRef<any>(null);

  const start = () => {
    try {
      if (pid) {
        measuresRef.current = [];
        poll.current = pollPerformanceMeasures(pid, (measure) => {
          // Keeping a ref here in case setMeasures is too slow
          measuresRef.current = [...measuresRef.current, measure];
          setMeasures(measuresRef.current);
        });
        setIsMeasuring(true);
      }
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error has occurred"
      );
    }
  };

  const stop = () => {
    poll.current?.stop();
    setIsMeasuring(false);
  };

  const reset = () => {
    measuresRef.current = [];
    setMeasures([]);
  };

  return { isMeasuring, reset, start, stop, measures };
};
