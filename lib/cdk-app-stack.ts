import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Cors, LambdaRestApi, RestApi } from "aws-cdk-lib/aws-apigateway";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export interface AppStackProps extends StackProps {
  expansion: {
    projectName: string;
    projectPrefix: string;
    env: string;
    envPrefix: string;
    apiResourcesPath: string;
    batchResourcesPath: string;
  };
}

export class CdkAppStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    // role
    const roleName = `${props.expansion.envPrefix}${props.expansion.projectPrefix}LambdaExecutionRole`;
    const lambdaExecutionRole = new Role(this, roleName, {
      roleName: roleName,
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")],
    });

    // lambda
    const functionName = `${props.expansion.envPrefix}${props.expansion.projectPrefix}Hogelambda`;
    const lambdaBaseProps = {
      runtime: Runtime.NODEJS_18_X,
      role: lambdaExecutionRole,
      handler: "index.handler",
      memorySize: 256,
      timeout: Duration.seconds(30),
      environment: {
        ENVIRONMENT: props.expansion.env, // 環境変数
      },
    };
    const lambda = new Function(this, functionName, {
      ...lambdaBaseProps,
      functionName: functionName,
      code: Code.fromAsset(`${props.expansion.apiResourcesPath}/hoge/`),
    });

    // apigw
    const apiName = `${props.expansion.envPrefix}${props.expansion.projectPrefix}api`;
    const restApi = new LambdaRestApi(this, apiName, {
      handler: lambda,
      proxy: true,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        statusCode: 200,
      },
    });
    restApi.node.addDependency(lambda);
  }
}
