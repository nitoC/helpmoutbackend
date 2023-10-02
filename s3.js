import aws from 'aws-sdk';
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()
const access = process.env.ACCESS_KEY
const secret = process.env.SECRET
const region = 'us-east-1';
aws.config.update({
    region,
    accessKeyId:access,
    secretAccessKey : secret
  })
const s3 = new aws.S3()
function uploadS3(params) {
    return new Promise((resolve, reject) => {
        console.log('in async');
        s3.upload({
            Bucket: 'blob-helpmeout',
            Key: params.filename,
            Body: fs.createReadStream(params.path)
        }, (err, data) => {
            if (err) {
                console.error(err);
                reject(err); // Reject the promise with the error
            } else {
                console.log("success");
                console.log(data.Location);
                resolve(data.Location); // Resolve the promise with the S3 object URL
            }
        });
    });
}


// Configure AWS SDK with your credentials and region
// Create an S3 instanc

 // Replace with the actual file key

// Specify where you want to save the downloaded file locally
//const localFilePath = 'downloaded-file.txt'; // Replace with your desired local file path

// Create a write stream to save the file locally
//const fileStream = fs.createWriteStream(localFilePath);

// Create a params object for the getObject operation

// Perform the getObject operation to download the file
function getFile(params) {
    
    const param = {
      Bucket: 'blob-helpmeout',
      Key: params,
    };
   let data = s3.getObject(param)
      .createReadStream()
      data.on('error', (err) => {
        console.error('Error downloading file:', err);
      });
      data.on('end', () => {
        console.log('File downloaded successfully');
      });
      return data;
}

export {uploadS3, getFile};