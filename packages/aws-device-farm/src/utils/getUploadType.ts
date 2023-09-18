import { UploadType } from "@aws-sdk/client-device-farm";
// Will be useful when we replace all apkPath with appPath to have a clear distinction between Android and iOS
export const getUploadType = (
  appPath: string
): UploadType.ANDROID_APP | UploadType.IOS_APP | undefined => {
  return appPath.endsWith(".apk")
    ? UploadType.ANDROID_APP
    : appPath.endsWith(".ipa")
    ? UploadType.IOS_APP
    : undefined;
};
