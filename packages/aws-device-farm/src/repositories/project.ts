import {
  ListProjectsCommand,
  CreateProjectCommand,
  DeleteProjectCommand,
} from "@aws-sdk/client-device-farm";
import { Logger } from "@perf-profiler/logger";
import { BaseRepository } from "./BaseRepository";

export class ProjectRepository extends BaseRepository {
  async getByName({ name }: { name: string }) {
    const { projects } = await this.client.send(new ListProjectsCommand({}));

    return projects?.find((project) => project.name === name);
  }

  async create({ name }: { name: string }) {
    Logger.info(`Creating project ${name}...`);
    this.client.send(
      new CreateProjectCommand({
        name,
      })
    );
    Logger.success(`Created project ${name}`);
  }

  async getOrCreate({ name }: { name: string }): Promise<string> {
    Logger.info("Retrieving projects...");
    const project = await this.getByName({ name });

    if (!project) {
      Logger.info(`Project with name ${name} not found`);
      await this.create({ name });
      return this.getOrCreate({ name });
    }

    const projectArn = project.arn;

    if (!projectArn) throw new Error(`Project has no arn`);
    Logger.success(`Found project ${name}`);

    return projectArn;
  }

  async delete({ name }: { name: string }) {
    const project = await this.getByName({ name });

    if (project) {
      Logger.info(`Removing project ${name}...`);
      await this.client.send(
        new DeleteProjectCommand({
          arn: project.arn,
        })
      );
      Logger.success(`Removed project ${name}`);
    } else {
      Logger.warn(`No project found with name ${name}`);
    }
  }
}
