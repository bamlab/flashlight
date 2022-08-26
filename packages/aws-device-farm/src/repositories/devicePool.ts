import {
  CreateDevicePoolCommand,
  ListDevicePoolsCommand,
} from "@aws-sdk/client-device-farm";
import { Logger } from "@perf-profiler/logger";
import { BaseRepository } from "./BaseRepository";

export class DevicePoolRepository extends BaseRepository {
  async getByName({ projectArn, name }: { projectArn: string; name: string }) {
    const { devicePools } = await this.client.send(
      new ListDevicePoolsCommand({ arn: projectArn })
    );

    return devicePools?.find((pool) => pool.name === name);
  }

  async create({
    projectArn,
    deviceName,
  }: {
    projectArn: string;
    deviceName: string;
  }) {
    return this.client.send(
      new CreateDevicePoolCommand({
        projectArn,
        name: deviceName,
        description: `Device pool composed of ${deviceName} used for Flashlight performance measurements`,
        maxDevices: 1,
        rules: [
          {
            attribute: "MODEL",
            operator: "CONTAINS",
            value: `"${deviceName}"`,
          },
        ],
      })
    );
  }

  async getOrCreate({
    projectArn,
    deviceName,
  }: {
    projectArn: string;
    deviceName: string;
  }): Promise<string> {
    Logger.info("Retrieving device pools...");
    const devicePool = await this.getByName({ projectArn, name: deviceName });

    if (!devicePool) {
      Logger.info(`Device Pool with name ${deviceName} not found`);
      await this.create({ projectArn, deviceName });
      return this.getOrCreate({ projectArn, deviceName });
    }

    const devicePoolArn = devicePool.arn;

    if (!devicePoolArn) throw new Error(`Device pool has no arn`);
    Logger.success(`Found device pool ${devicePool.name}`);

    return devicePoolArn;
  }
}
