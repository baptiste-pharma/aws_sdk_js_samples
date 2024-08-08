import { EC2Client, DescribeInstancesCommand, StopInstancesCommand, DescribeInstanceStatusCommand } from "@aws-sdk/client-ec2"; // ES Modules import

const client = new EC2Client();

const getInstancesIds = async () => {
    
    const input = { 
        Filters: [ 
            { 
                Name: process.env.TAG_TAG, 
                Values: [ process.env.TAG_KEY ]
            }
        ]
    };

    const command = new DescribeInstancesCommand(input);

    try {

        const response = await client.send(command);

        if (response.$metadata.httpStatusCode ==! 200) {
            throw new Error("The instance id request failed");
        }

        if (!response.Reservations.length ){
            throw new Error("No instances detected");
        }
        
        let instancesIds = [];

        response.Reservations.forEach(reservation => {
            reservation.Instances.forEach(instance => {
                instancesIds.push(instance.InstanceId);
            });
        });

        return instancesIds;

    } catch (error) {
        console.error(error);
        return false;
    }
};

const checkInstancesStatus = async () => {
    
    try {
    
        const instancesIds = await getInstancesIds();

        if (!instancesIds) {
            throw new Error("No instances to check");
        }

        const input = { 
            InstanceIds: instancesIds
        };

        const command = new DescribeInstanceStatusCommand(input);
    
        const response = await client.send(command);

        response.InstanceStatuses.forEach( instance => {
            if (instance.InstanceState.Name ==! "running" && instance.InstanceState.Name ==! "stopped") {
                throw new Error("Instances not ready")
            };
        });

        return true;
    
    } catch(error) {
        console.error(error);
        return false;
    }
};

export const stopInstances = async (event, context) => {
    try {
        
        if (!checkInstancesStatus()) throw new Error("Instances status check failed");
        
        const instancesIds = await getInstancesIds();

        if (!instancesIds) {
            throw new Error("Couldn't retrieve instanceId");
        }

        const input = { 
            InstanceIds: instancesIds
        };

        const command = new StopInstancesCommand(input);
        
        const response = await client.send(command);

        if (response.$metadata.httpStatusCode ==! 200) {
            throw new Error("The stop request failed");
        }
        
        const message = "Instances stopped by " +  event.CallerName;

        return { StatusCode: 200, Message: message }

    } catch (error) {
        return { statusCode: 500, message: error };
    }

};