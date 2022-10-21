import axios from "axios";
import fs from "fs";

// AWS Lambda don't have curl
export const downloadFile = async (
  url: string,
  destinationFilePath: string
) => {
  const { data } = await axios.get(url, {
    responseType: "arraybuffer", // Important
    headers: {
      "Content-Type": "application/gzip",
    },
  });

  fs.writeFileSync(destinationFilePath, data);
};
