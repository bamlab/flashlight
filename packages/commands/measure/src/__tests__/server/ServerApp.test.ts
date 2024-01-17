import supertest from "supertest";
import express from "express";
import fs from "fs";

import { createExpressApp } from "../../server/ServerApp";
import type { FlashlightData } from "../../common/types";

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

describe("ServerApp", () => {
  let app: express.Express;
  const injected: FlashlightData = { socketServerUrl: "http://localhost:9999" };

  beforeAll(() => {
    jest.spyOn(express, "static").mockImplementation(() => (req, res, next) => next());
  });

  beforeEach(() => {
    (fs.promises.readFile as jest.Mock).mockResolvedValue("<html>/* %FLASHLIGHT_DATA% */</html>");

    app = createExpressApp(injected);
  });

  describe("GET /", () => {
    it("injects FlashlightData into index.html", async () => {
      const response = await supertest(app).get("/");

      expect(response.statusCode).toBe(200);
      expect(response.text).toContain(`window.__FLASHLIGHT_DATA__ = ${JSON.stringify(injected)};`);
    });
  });

  test("index.html contains the FlashlightData placeholder", async () => {
    const fsPromises = jest.requireActual("fs").promises;
    const fileContent = await fsPromises.readFile(`${__dirname}/../../webapp/index.html`, "utf8");
    expect(fileContent).toContain("/* %FLASHLIGHT_DATA% */");
  });
});
