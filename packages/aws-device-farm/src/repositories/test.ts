import {
  ArtifactCategory,
  ArtifactType,
  ExecutionResult,
  ExecutionStatus,
  GetRunCommand,
  ListArtifactsCommand,
  ListRunsCommand,
  ScheduleRunCommand,
  TestType,
} from "@aws-sdk/client-device-farm";
import { execSync } from "child_process";
import { Logger } from "@perf-profiler/logger";
import { BaseRepository } from "./BaseRepository";

export class TestRepository extends BaseRepository {
  async getByName({ projectArn, name }: { projectArn: string; name: string }) {
    const { runs } = await this.client.send(
      new ListRunsCommand({ arn: projectArn })
    );

    return runs?.find((run) => run.name === name);
  }

  /**
   * aws devicefarm schedule-run --project-arn $PROJECT_ARN
   *  --app-arn $APK_UPLOAD_ARN
   *  --device-pool-arn $DEVICE_POOL_ARN
   *  --name Flash
   *  --test testSpecArn=$TEST_SPEC_UPLOAD_ARN,type=APPIUM_NODE,testPackageArn=$TESTS_UPLOAD_ARN
   */
  async scheduleRun({
    projectArn,
    apkUploadArn,
    devicePoolArn,
    testName,
    testPackageArn,
    testSpecArn,
  }: {
    projectArn: string;
    apkUploadArn: string;
    devicePoolArn: string;
    testName: string;
    testPackageArn: string;
    testSpecArn: string;
  }) {
    const { run } = await this.client.send(
      new ScheduleRunCommand({
        projectArn,
        appArn: apkUploadArn,
        devicePoolArn,
        name: testName,
        test: {
          type: TestType.APPIUM_NODE,
          testPackageArn,
          testSpecArn,
        },
      })
    );

    const testRunArn = run?.arn;

    if (!testRunArn) throw new Error(`Test run has no arn`);

    const consoleUrl = await this.getUrl({
      testRunArn,
    });
    // Hack to add the variable into Github actions although it shouldn't be done here
    if (process.env.GITHUB_ENV) {
      execSync(`echo "AWS_CONSOLE_TEST_RUN_URL=${consoleUrl}" >> $GITHUB_ENV`);
    }
    Logger.success(
      `Launched test ${testName}...
Follow along on ${consoleUrl}`
    );

    return testRunArn;
  }

  async isTestCompleted({ arn }: { arn: string }) {
    const { run } = await this.client.send(new GetRunCommand({ arn }));

    if (!run) throw new Error("Test run couldn't be found");

    Logger.info(`Test status is ${run.status}, result is ${run.result}`);

    if (run.status === ExecutionStatus.COMPLETED) {
      if (run.result !== ExecutionResult.PASSED) {
        throw new Error(`Test run has not succeeded, result is ${run.result}`);
      }

      return true;
    }

    return false;
  }

  async waitForCompletion({ arn }: { arn: string }) {
    while (!(await this.isTestCompleted({ arn }))) {
      Logger.info(`Waiting 10s for test to be done...`);
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }

  async getArtifactUrl({ arn, type }: { arn: string; type: ArtifactType }) {
    const { artifacts } = await this.client.send(
      new ListArtifactsCommand({
        arn,
        type: ArtifactCategory.FILE,
      })
    );

    const url = artifacts?.find((artifact) => artifact.type === type)?.url;

    if (!url) throw new Error(`Url not found for artifact type ${type}`);

    return url;
  }

  async getUrl({ testRunArn }: { testRunArn: string }) {
    const [projectId, runId] = testRunArn.split("run:")[1].split("/");
    const region = await this.client.config.region();

    return `https://${region}.console.aws.amazon.com/devicefarm/home?region=${region}#/mobile/projects/${projectId}/runs/${runId}/jobs/00000`;
  }
}
