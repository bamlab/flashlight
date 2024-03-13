/* eslint-disable import/no-extraneous-dependencies */
import { TextEncoder, TextDecoder } from "util";
import "@perf-profiler/web-reporter-ui/mockApexChart";

process.env.AWS_ACCESS_KEY_ID = "MOCK_AWS_ACCESS_KEY_ID";
process.env.AWS_SECRET_ACCESS_KEY = "MOCK_AWS_SECRET_ACCESS_KEY";

Math.random = jest.fn(() => 0.5);

// Needed to be able to test socket.io v>=4.7.0 in a jsdom environment
// We use jsdom since we snapshot the webapp in the measure command while running the socket
global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.TextDecoder = TextDecoder;
