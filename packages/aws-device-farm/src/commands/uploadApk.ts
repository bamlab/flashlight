import { UploadType } from "@aws-sdk/client-device-farm";
import { Logger } from "@perf-profiler/logger";
import { projectRepository, uploadRepository } from "../repositories";

export const uploadApk = async ({
  apkPath,
  projectName,
}: {
  apkPath: string;
  projectName: string;
}) => {
  const projectArn = await projectRepository.getOrCreate({
    name: projectName,
  });

  const apkUploadArn = await uploadRepository.upload({
    projectArn,
    filePath: apkPath,
    type: UploadType.ANDROID_APP,
  });

  Logger.success(`APK uploaded: ${apkUploadArn}`);
};
