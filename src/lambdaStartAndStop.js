import { EC2Client, DescribeInstancesCommand, StartInstancesCommand, StopInstancesCommand, DescribeInstanceStatusCommand } from "@aws-sdk/client-ec2"; // ES Modules import

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
            throw new Error("The request failed");
        }

        if (!response.Reservations.length ){
            throw new Error("No instances ")
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

        let count = 0;
        let isReady = false;

        while (!isReady && count < 12) {
            isReady = true;
            count++;

            const command = new DescribeInstanceStatusCommand(input);
        
            const response = await client.send(command);

            response.InstanceStatuses.forEach( instance => {
                if (instance.InstanceState.Name ==! "running" && instance.InstanceState.Name ==! "stopped") isReady = false;
            })

            await new Promise(resolve => setTimeout(resolve, 5000)); // ligne magique, c'est quoi ce bordel ?
        }

        return true;
    
    } catch(error) {
        console.error(error);
        return false;
    }
}

const startInstances = async () => {
    try {
    
        const instancesIds = await getInstancesIds();

        if (instancesIds === false) {
            throw new Error("Couldn't send request")
        }

        const input = { 
            InstanceIds: instancesIds
        };

        const command = new StartInstancesCommand(input);
        
        const response = await client.send(command);

        if (response.$metadata.httpStatusCode ==! 200) {
            throw new Error("The request failed");
        };

        return JSON.stringify(response, null, 3);

    } catch {
        return "" + error;
    }

};


const stopInstances = async () => {
    try {
    
        const instancesIds = await getInstancesIds();

        if (instancesIds === false) {
            throw new Error("Couldn't send request")
        }

        const input = { 
            InstanceIds: instancesIds
        };

        const command = new StopInstancesCommand(input);
        
        const response = await client.send(command);

        if (response.$metadata.httpStatusCode ==! 200) {
            throw new Error("The request failed");
        };

        return JSON.stringify(response, null, 3);

    } catch {
        return "" + error;
    }

};

if (await checkInstancesStatus()) console.log(await startInstances());