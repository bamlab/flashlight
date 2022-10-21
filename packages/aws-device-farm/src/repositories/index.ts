import { DeviceFarmClient } from "@aws-sdk/client-device-farm";
import { DevicePoolRepository } from "./devicePool";
import { ProjectRepository } from "./project";
import { TestRepository } from "./test";
import { UploadRepository } from "./upload";

const DEFAULT_REGION = "us-west-2";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  throw new Error(
    "Please provide AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables"
  );
}

const client = new DeviceFarmClient({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: DEFAULT_REGION,
});

export const projectRepository = new ProjectRepository(client);
export const devicePoolRepository = new DevicePoolRepository(client);
export const uploadRepository = new UploadRepository(client);
export const testRepository = new TestRepository(client);
