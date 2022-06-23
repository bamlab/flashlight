import { GfxInfoParser } from "../GfxInfoParser";

jest
  .spyOn(require("../../shell"), "executeCommand")
  .mockImplementation(() =>
    require("fs").readFileSync(`${__dirname}/GfxInfoSample.txt`, "utf8")
  );

const androidPackage = "mockPackage";
test("GfxInfoParser", () => {
  expect(new GfxInfoParser({ androidPackage }).measure()).toEqual({
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
