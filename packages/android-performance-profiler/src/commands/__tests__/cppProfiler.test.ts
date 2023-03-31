import { parseCppMeasure } from "../cppProfiler";

test("parseCppMeasure", () => {
  const CPU = `This is
CPU Info
on multiple lines`;
  const ATrace = `This is
Atrace
on multiple lines`;
  const RAM = `This is
RAM Info
on multiple lines`;
  const TIMESTAMP = 123456;
  const ADB_EXEC_TIME = 42;
  const PID = "1234";

  expect(
    parseCppMeasure(`=START MEASURE=
${PID}
=SEPARATOR=
${CPU}
=SEPARATOR=
${RAM}
=SEPARATOR=
${ATrace}
=SEPARATOR=
Timestamp: ${TIMESTAMP}
ADB EXEC TIME: ${ADB_EXEC_TIME}`)
  ).toEqual({
    pid: PID,
    cpu: CPU,
    ram: RAM,
    atrace: ATrace,
    timestamp: TIMESTAMP,
  });
});
