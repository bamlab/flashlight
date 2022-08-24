import { parseCppMeasure } from "../cppProfiler";

test("parseCppMeasure", () => {
  const CPU = `This is
CPU Info
on multiple lines`;
  const GFXINFO = `This is
GFX Info
on multiple lines`;
  const RAM = `This is
RAM Info
on multiple lines`;
  const TIMESTAMP = 123456;
  const ADB_EXEC_TIME = 42;

  expect(
    parseCppMeasure(`=START MEASURE=
${CPU}
=SEPARATOR=
${RAM}
=SEPARATOR=
${GFXINFO}
=SEPARATOR=
Timestamp: ${TIMESTAMP}
ADB EXEC TIME: ${ADB_EXEC_TIME}`)
  ).toEqual({
    cpu: CPU,
    ram: RAM,
    gfxinfo: GFXINFO,
    timestamp: TIMESTAMP,
    adbExecTime: ADB_EXEC_TIME,
  });
});
