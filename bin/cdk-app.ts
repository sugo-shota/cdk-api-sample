#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkAppStack } from "../lib/cdk-app-stack";

const app = new cdk.App();

const projectName = "project";
const projectPrefix = `${projectName}-`;
const env = process.env.ENVIRONMENT || "dev";
const envPrefix = `${env}-`;
const resourcesBasePath = "resources";
const apiResourcesPath = `${resourcesBasePath}/api`;
const batchResourcesPath = `${resourcesBasePath}/batch`;

const appStackProps = {
  env: {
    region: process.env.DEFAULT_REGION || "ap-northeast-1",
    account: process.env.DEFAULT_ACCOUNT_ID,
  },
  tags: {
    Name: "test",
  },
  expansion: {
    projectName,
    projectPrefix,
    env,
    envPrefix,
    apiResourcesPath,
    batchResourcesPath,
  },
};

new CdkAppStack(app, `${projectPrefix}AppStack`, appStackProps);
