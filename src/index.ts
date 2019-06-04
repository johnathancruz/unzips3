import { Callback, Context, Handler, S3Event } from 'aws-lambda';
import * as S3Unziplus from 's3-unzip-plus';

const Unzip: Handler = (event: S3Event, context: Context, callback: Callback) => {
    interface IFileToUnzip {
        bucket: string;
        deleteOnSuccess: boolean;
        file: string;
        targetBucket: string;
        targetKey: string;
        verbose: boolean;
    }

    const fileToUnzip: IFileToUnzip = getFileToUnzip(event);

    const s3unzip = new S3Unziplus(fileToUnzip, (err: any, success: any) => {
        if (err) {
            callback(err, null);
        } else {
            callback(undefined, success);
        }
    });

    function getFileToUnzip(s3Event: S3Event): IFileToUnzip {
        const bucketName = s3Event.Records[0].s3.bucket.name;
        const zipedFile = s3Event.Records[0].s3.object.key;
        const targetBucket = zipedFile.split("_")[0];
        const targetKeyName = zipedFile.split("_")[1].split(".")[0];
    
        const file: IFileToUnzip = {
            bucket: bucketName,
            deleteOnSuccess: false,
            file: zipedFile,
            targetBucket: targetBucket + "/" + targetKeyName,
            targetKey: targetKeyName,
            verbose: false
        };
    
        return file;
    }
};

export { Unzip };