import {
  CreateUploadCommand,
  DeleteUploadCommand,
  GetUploadCommand,
  ListUploadsCommand,
  UploadType,
} from "@aws-sdk/client-device-farm";
import path from "path";
import { Logger } from "@perf-profiler/logger";
import { BaseRepository } from "./BaseRepository";
import { uploadFile } from "../uploadFile";

export class UploadRepository extends BaseRepository {
  async isUploadSucceeded({ arn }: { arn: string }) {
    const { upload } = await this.client.send(new GetUploadCommand({ arn }));

    if (!upload) throw new Error("Could not find upload");

    return upload.status === "SUCCEEDED";
  }

  async getByName({
    projectArn,
    name,
    type,
  }: {
    projectArn: string;
    name: string;
    type: UploadType;
  }) {
    const { uploads } = await this.client.send(
      new ListUploadsCommand({ arn: projectArn, type })
    );

    return uploads?.find((upload) => upload.name === name);
  }

  async create({
    projectArn,
    name,
    type,
  }: {
    projectArn: string;
    name: string;
    type: UploadType;
  }) {
    return this.client.send(
      new CreateUploadCommand({
        projectArn,
        name,
        type,
      })
    );
  }

  async createOrReplace({
    projectArn,
    name,
    type,
  }: {
    projectArn: string;
    name: string;
    type: UploadType;
  }): Promise<{
    arn: string;
    url: string;
  }> {
    await this.delete({
      projectArn,
      name,
      type,
    });

    const { upload } = await this.create({ projectArn, name, type });

    const arn = upload?.arn;
    const url = upload?.url;

    if (!arn) throw new Error(`Upload has no arn`);
    if (!url) throw new Error(`Upload has no url`);
    Logger.info(
      `Created upload entry ready to receive file for ${upload.name}...`
    );

    return { arn, url };
  }

  async delete({
    projectArn,
    name,
    type,
  }: {
    projectArn: string;
    name: string;
    type: UploadType;
  }) {
    const upload = await this.getByName({ projectArn, name, type });

    if (upload?.arn) {
      Logger.info(`Replacing upload ${name}...`);
      await this.client.send(
        new DeleteUploadCommand({
          arn: upload.arn,
        })
      );
    }
  }

  async upload({
    projectArn,
    filePath,
    type,
    name: nameGiven,
  }: {
    projectArn: string;
    filePath: string;
    type: UploadType;
    name?: string;
  }) {
    const name = nameGiven || path.basename(filePath);
    const { url, arn } = await this.createOrReplace({
      projectArn,
      name,
      type,
    });
    await uploadFile(url, filePath);

    while (!(await this.isUploadSucceeded({ arn }))) {
      Logger.info(`Waiting 2s for ${name} to be ready`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    Logger.success(`Upload ${name} ready for use`);

    return arn;
  }
}
