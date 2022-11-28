import { testRepository } from "../../repositories";
import { checkResults } from "../checkResults";
import fs from "fs";
import axios from "axios";

// Need to mock axios because of https://github.com/axios/axios/issues/5026
jest.mock("axios", () => ({
  get: jest.fn(),
}));

describe("checkResults", () => {
  const FOLDER_WITH_SPACES = `${__dirname}/My folder with spaces`;

  beforeEach(() => {
    if (fs.existsSync(FOLDER_WITH_SPACES)) {
      fs.rmSync(FOLDER_WITH_SPACES, { recursive: true, force: true });
    }
    fs.mkdirSync(FOLDER_WITH_SPACES);
  });

  it("writes results to a folder with spaces", async () => {
    jest.spyOn(testRepository, "waitForCompletion").mockResolvedValueOnce();
    jest
      .spyOn(testRepository, "getArtifactUrl")
      .mockResolvedValueOnce("https://url.com");
    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: fs.readFileSync(`${__dirname}/results.json.zip`),
    });

    await checkResults({
      testRunArn: "testRunArn",
      reportDestinationPath: FOLDER_WITH_SPACES,
    });

    const OUTPUT_FILE = `${FOLDER_WITH_SPACES}/results.json`;
    expect(fs.existsSync(OUTPUT_FILE)).toBe(true);
    expect(fs.readFileSync(OUTPUT_FILE).toString()).toEqual(
      '{ "data": { "thisIs": "data" } }'
    );
  });

  afterEach(() => {
    fs.rmSync(FOLDER_WITH_SPACES, { recursive: true, force: true });
  });
});
