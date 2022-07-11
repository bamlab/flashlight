import { execLoopCommands } from "../shellNext";

test("compareGfxMeasures", async () => {
  const results: Record<string, string>[] = [];
  const polling = execLoopCommands(
    [
      {
        id: "TOTO",
        command: "echo TOTO",
      },
      {
        id: "LONG_FILE",
        command: `echo "$(<${__dirname}/long-file.txt)"`,
      },
      { id: "YOUPI", command: `echo "YOUPI"` },
    ],
    0.2,
    (data) => results.push(data),
    false
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));

  polling?.stop();
  // Arbitrarily check the 3 first results, even though we should have 1000/(0.2 * 1000) = 5 results
  // but it's not 100% deterministic
  for (let index = 0; index < 3; index++) {
    const result = results[index];
    expect(result.TOTO).toEqual("TOTO");
    expect(result.YOUPI).toEqual("YOUPI");
    expect(result.LONG_FILE.length).toEqual(2429);
  }
});
