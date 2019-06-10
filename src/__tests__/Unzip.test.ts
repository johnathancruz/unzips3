import { S3Event, S3EventRecord } from 'aws-lambda';

const s3EventRecord: S3EventRecord = {
    awsRegion: '',
    eventName: '',
    eventSource: '',
    eventTime: '',
    eventVersion: '',
    requestParameters: {
        sourceIPAddress: ''
    },
    responseElements: {
        'x-amz-id-2': '',
        'x-amz-request-id': ''
    },
    s3: {
        bucket: {
            arn: '',
            name: '',
            ownerIdentity: {
                principalId: ''
            }
        },
        configurationId: '',
        object: {
            eTag: '',
            key: '',
            sequencer: '',
            size: 0,
            versionId: ''
        },
        s3SchemaVersion: ''
    },
    userIdentity: {
        principalId: ''
    }
};

const records: S3EventRecord[] = [s3EventRecord];

const s3Event: S3Event = {
    Records: records
}

describe('Unzip S3 Test', () => {
    test('Create IFileToUnzip', () => {
    });
});