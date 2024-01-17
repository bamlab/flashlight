import { io } from "socket.io-client";

jest.mock("socket.io-client", () => {
  return {
    ...jest.requireActual("socket.io-client"),
    io: jest.fn().mockImplementation(() => {
      return {
        on: jest.fn(),
        close: jest.fn(),
      };
    }),
  };
});

let originalWindow: Window & typeof globalThis;

describe("socket", () => {
  beforeAll(async () => {
    originalWindow = global.window;

    global.window = Object.create(window);
    Object.defineProperty(window, "__FLASHLIGHT_DATA__", {
      value: { socketServerUrl: "http://localhost:9999" },
      writable: true,
    });
  });

  afterAll(() => {
    // Restore the original window object
    global.window = originalWindow;
  });

  it("sets the expected socket server URL", async () => {
    await import("../../webapp/socket");
    expect(io).toHaveBeenCalledWith("http://localhost:9999");
  });
});
