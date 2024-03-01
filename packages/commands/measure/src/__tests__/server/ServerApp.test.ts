import supertest from "supertest";
import express from "express";
import fs from "fs";

import { createExpressApp } from "../../server/ServerApp";

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

describe("ServerApp", () => {
  let app: express.Express;

  beforeAll(() => {
    jest.spyOn(express, "static").mockImplementation(() => (req, res, next) => next());
  });

  const FLASHLIGHT_DATA_PLACEHOLDER =
    'window.__FLASHLIGHT_DATA__ = { socketServerUrl: "http://localhost:3000" };';

  beforeEach(() => {
    (fs.promises.readFile as jest.Mock).mockResolvedValue(
      `<html><script>${FLASHLIGHT_DATA_PLACEHOLDER}</script></html>`
    );

    app = createExpressApp({
      port: 9999,
    });
  });

  describe("GET /", () => {
    it("injects FlashlightData into index.html", async () => {
      const response = await supertest(app).get("/");

      expect(response.statusCode).toBe(200);
      expect(response.text).toContain(
        `window.__FLASHLIGHT_DATA__ = { socketServerUrl: "http://localhost:9999" };`
      );
    });
  });

  test("index.html contains the FlashlightData placeholder", async () => {
    const fsPromises = jest.requireActual("fs").promises;
    const fileContent = await fsPromises.readFile(`${__dirname}/../../webapp/index.html`, "utf8");
    expect(fileContent).toContain(FLASHLIGHT_DATA_PLACEHOLDER);
  });
});
