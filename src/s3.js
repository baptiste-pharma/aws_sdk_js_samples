import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

// When no region or credentials are provided, the SDK will use the
// region and credentials from the local AWS config.
const client = new S3Client();

export const helloS3 = async () => {
  const input = { "Bucket": process.env.BUCKET_NAME };
  const command = new ListObjectsV2Command(input);

  const  response  = await client.send(command);
  console.log(response.Contents)
  //console.log(S3Objects.map((content) => content.Key).join("\n"));
  return response;
};

helloS3();
