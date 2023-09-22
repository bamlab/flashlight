import { parseGfxInfo } from "../parseGfxInfo";

jest
  .spyOn(require("../../shell"), "executeCommand")
  .mockImplementation(() => require("fs").readFileSync(`${__dirname}/GfxInfoSample.txt`, "utf8"));

const bundleId = "mockPackage";
test("GfxInfoParser", () => {
  expect(parseGfxInfo(bundleId)).toMatchObject({
    realtime: 1555308405,
    jankyFrames: {
      count: 4,
      totalRendered: 21,
    },
    renderingTime: {
      totalFramesRendered: 21,
      totalRenderTime: 684,
    },
  });
});
