import { Callback, Context, Handler, S3Event } from 'aws-lambda';
import s3UnzipPlus from 's3-unzip-plus';

interface IFileToUnzip {
  bucket: string;
  deleteOnSuccess: boolean;
  file: string;
  targetBucket: string;
  targetKey: string;
  verbose: boolean;
}

function getFileToUnzip(s3Event: S3Event): IFileToUnzip {
  const bucketName = s3Event.Records[0].s3.bucket.name;
  const zipedFile = s3Event.Records[0].s3.object.key;
  const targetBucket = zipedFile.split('/')[0];
  const targetKeyName = zipedFile.split('/')[1].split('.')[0];

  const file: IFileToUnzip = {
    bucket: bucketName,
    deleteOnSuccess: false,
    file: zipedFile,
    targetBucket: targetBucket + '/' + targetKeyName,
    targetKey: targetKeyName,
    verbose: false,
  };

  return file;
}

const handler: Handler = (event: S3Event, context: Context, callback: Callback) => {
  const fileToUnzip: IFileToUnzip = getFileToUnzip(event);

  const ignored = new s3UnzipPlus(fileToUnzip, (err: any, success: any) => {
    if (err) {
      callback(err, null);
    } else {
      callback(undefined, success);
    }
  });
};

export { handler };
