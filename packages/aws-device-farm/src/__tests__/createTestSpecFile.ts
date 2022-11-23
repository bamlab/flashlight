import { getSingleTestFileYml, getTestCommandYml } from "../createTestSpecFile";

describe("createTestSpecFile", () => {
  it("creates a test spec for a single TS file", () => {
    expect(
      getSingleTestFileYml({
        // not a real TS file so that tests don't try to run it
        testFile: `${__dirname}/sampletsfile`,
        postTestCommand:
          "curl -X POST -H 'Content-type: application/json' --data '{\"test\":\"data\"}' https://webhook.com",
      })
    ).toMatchSnapshot();
  });

  it("creates a test spec for a given test command", () => {
    expect(
      getTestCommandYml({
        testCommand: "echo 'this is the test command'",
        testSpecsPath: `${__dirname}/../../flashlight.yml`,
      })
    ).toMatchSnapshot();
  });
});
