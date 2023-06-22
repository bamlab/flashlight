export const PORT = 3000;
export const WEBAPP_URL =
  process.env.API_URL === "local"
    ? "http://localhost:1234"
    : `http://localhost:${PORT}`;
