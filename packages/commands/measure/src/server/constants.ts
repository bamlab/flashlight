export const DEFAULT_PORT = 3000;

export const getWebAppUrl = (port: number = DEFAULT_PORT) => {
  if (process.env.DEVELOPMENT_MODE === "true") {
    return "http://localhost:1234";
  }
  return `http://localhost:${port}`;
};
