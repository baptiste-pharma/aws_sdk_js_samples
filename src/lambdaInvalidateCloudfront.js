import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

const client = new CloudFrontClient();

export const invalidateCache = async (event, context) => {
    

        // const bucket = event.Records[0].s3.bucket.name;
        // const key = event.Records[0].s3.object.key;
        const caller = "Akore" + Date.now()

        const objects_path = ["/*"]

        const input = { // CreateInvalidationRequest
            DistributionId: process.env.DISTRIBUTION_ID, // required
            InvalidationBatch: { // InvalidationBatch
              Paths: { // Paths
                Quantity: 1, // required
                Items: objects_path,
              },
              CallerReference: caller, // required
            },
          };

          const command = new CreateInvalidationCommand(input);
    try {
          const response = await client.send(command);

          if (response.$metadata.httpStatusCode ==! 200) {
            throw new Error("The request failed");
        }

          return response;

    } catch (error) {
        return { statusCode: 500, message: error };
    }
    
       
}
