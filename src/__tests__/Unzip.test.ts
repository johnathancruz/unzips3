
import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { Unzip } from '../index';
import { Context } from 'aws-lambda';

describe('Upload zip file', () => {
  beforeAll(() => {
    AWSMock.mock('S3', 'S3PutEvent', (method, _, callback) => {
      callback(null, {
        data: 'https://example.com'
      });
    });
  });

  afterAll(() => {
    AWSMock.restore('S3');
  });

  test('Unzip S3', () => {
    const event = eventStub;
    const context: Context = new Context;

    const result = Unzip(event, context, callback);
  });
});

test('Unzip S3', () => {
  expect(Unzip({
    "event":{
      "Records": [
        {
          "s3": {
            "bucket": {
              "name": "test-bucket-in-s3"
            },
            "object": {
              "key": "Companies.zip"
            }
          }
        }
      ]
    }
  }, null, null)).toBe({});
});
