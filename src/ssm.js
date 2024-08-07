import { SSMClient, SendCommandCommand } from "@aws-sdk/client-ssm";

// When no region or credentials are provided, the SDK will use the
// region and credentials from the local AWS config.

const ssmclient = new SSMClient();

export const helloSSM = async () => {
  const input = {
    InstanceIds: [ // InstanceIdList
      process.env.SSM_INSTANCE_ID,
    ],
    DocumentName: "Example",
    Parameters: {
      "Message": [
        "Hello World!", 
      ]
    }
  };

  const command = new SendCommandCommand(input);

  const response = await ssmclient.send(command);

  console.log(response.Command.CommandId);
  return response;
}

helloSSM();

