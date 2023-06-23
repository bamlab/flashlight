export const PORT = 3000;
export const WEBAPP_URL =
  process.env.DEVELOPMENT_MODE === "true"
    ? "http://localhost:1234"
    : `http://localhost:${PORT}`;
