import { DeviceFarmClient } from "@aws-sdk/client-device-farm";

export class BaseRepository {
  constructor(protected client: DeviceFarmClient) {}
}
