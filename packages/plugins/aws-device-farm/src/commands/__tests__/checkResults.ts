import { testRepository } from "../../repositories";
import { checkResults } from "../checkResults";
import fs from "fs";
import axios from "axios";

// Need to mock axios because of https://github.com/axios/axios/issues/5026
jest.mock("axios", () => ({
  get: jest.fn(),
}));

// Downloading FFMpeg binary takes time
jest.setTimeout(30000);

describe("checkResults", () => {
  const FOLDER_WITH_SPACES = `${__dirname}/My folder with spaces`;

  beforeEach(() => {
    if (fs.existsSync(FOLDER_WITH_SPACES)) {
      fs.rmSync(FOLDER_WITH_SPACES, { recursive: true, force: true });
    }
  });

  it("writes results to a folder with spaces", async () => {
    jest.spyOn(testRepository, "waitForCompletion").mockResolvedValueOnce();
    jest.spyOn(testRepository, "getArtifactUrl").mockResolvedValueOnce("https://url.com");
    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: fs.readFileSync(`${__dirname}/results.json.zip`),
    });
    // Actually download FFMpeg binary
    jest.spyOn(axios, "get").mockImplementationOnce(jest.requireActual("axios").get);

    await checkResults({
      testRunArn: "testRunArn",
      reportDestinationPath: FOLDER_WITH_SPACES,
    });

    const OUTPUT_FILE = `${FOLDER_WITH_SPACES}/results.json`;
    expect(fs.existsSync(OUTPUT_FILE)).toBe(true);
    expect(JSON.parse(fs.readFileSync(OUTPUT_FILE).toString())).toEqual({
      name: "Report",
      iterations: [
        {},
        {
          videoInfos: { path: `${__dirname}/My folder with spaces/video.mp4` },
        },
      ],
    });
  });

  afterEach(() => {
    fs.rmSync(FOLDER_WITH_SPACES, { recursive: true, force: true });
  });
});
