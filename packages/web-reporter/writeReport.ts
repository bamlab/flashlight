import fs from "fs";

export const writeReport = ({
  jsonPaths,
  outputDir,
}: {
  jsonPaths: string[];
  outputDir: string;
}) => {
  const newJsFile = "report.js";

  const oldHtmlContent = fs.readFileSync(`${__dirname}/index.html`, "utf8");
  const scriptName = oldHtmlContent.match(/src="(.*?)"/)?.[1];

  const newHtmlContent = fs
    .readFileSync(`${__dirname}/index.html`, "utf8")
    .replace(`src="${scriptName}"`, `src="${newJsFile}"`)
    .replace('type="module"', "");

  const getJsonPaths = () => {
    return jsonPaths
      .map((path) => {
        const isDirectory = fs.lstatSync(path).isDirectory();

        if (isDirectory) {
          return fs
            .readdirSync(path)
            .filter((file) => file.endsWith(".json"))
            .map((file) => `${path}/${file}`);
        } else {
          return path;
        }
      })
      .flat();
  };

  const report = JSON.stringify(
    getJsonPaths().map((path) => JSON.parse(fs.readFileSync(path, "utf8")))
  );

  const jsFileContent = fs
    .readFileSync(`${__dirname}/${scriptName}`, "utf8")
    .replace('"INSERT_HERE"', report);

  fs.writeFileSync(`${outputDir}/report.js`, jsFileContent);

  const htmlFilePath = `${outputDir}/report.html`;
  fs.writeFileSync(htmlFilePath, newHtmlContent);

  return htmlFilePath;
};
