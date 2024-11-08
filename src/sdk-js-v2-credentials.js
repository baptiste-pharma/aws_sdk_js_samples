const AWS = require('aws-sdk');

// var profile = new AWS.SsoCredentials({profile: 'all'});
var ec2 =  new AWS.EC2MetadataCredentials();

if (ec2.expireTime === null) {
    var creds = new AWS.Credentials({
        accessKeyId: process.env.ACCESS_KEY_AWS,
        secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS,
        region: 'eu-west-3'
    });
    AWS.config.credentials = creds;
    console.log("using creds")
} else {
    AWS.config.credentials = ec2;
    AWS.config.update({ region: 'eu-west-3' });
    console.log("using ec2")
}

const s3 = new AWS.S3();
// var chain = new AWS.CredentialProviderChain([
//     ec2,
//     profile
// ]);

// chain.resolve(function(err, creds) {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log
//     AWS.config.credentials = creds;

// });


// AWS.config.credentials = chain.resolve();

// console.log(AWS.config.credentials);

// AWS.config.update({ region: 'eu-west-3' });


// const s3 = new AWS.S3();


// var params = {
//     Bucket: "challenges-pharmacies-bucket-test",
//     MaxKeys: 2
// };

// s3.listObjectsV2(params, function(err, data) {
//     if (err) console.log(err, err.stack); // an error occurred
//     else     console.log(data);           // successful response
// });
