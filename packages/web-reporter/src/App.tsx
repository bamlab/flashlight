import { ReporterView } from "@performance-profiler/web-reporter-ui";
import measures from "./measures.json";

export function App() {
  return (
    <>
      <ReporterView measures={measures[5].measures} />
    </>
  );
}
