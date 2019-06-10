const { src, dest, series, parallel } = require('gulp');
const install = require('gulp-install');
const minify = require('gulp-babel-minify');
const zip = require('gulp-zip');
const del = require('del');
const AWS = require('aws-sdk');
const fs = require('fs');

const outputName = 'unzips3.zip';
const region = 'us-east-2';
const functionName = 'unzip-uploaded';
const bucketName = 'predict.uploads';
const IAMRole = 'arn:aws:iam::873726131902:role/service-role/unzip_s3-role-tc5q1wj0';

function clean() {
    return del([
        `${outputName}`,
        'dist'
    ]);
}

function copy() {
    return src('index.js')
    .pipe(dest('dist/'));
}

function minifyJs() {
    return src('dist/*.js')
    .pipe(minify())
    .pipe(dest('dist/'));
}

function installMods() {
    return src('./package.json')
        .pipe(dest('dist/'))
        .pipe(install({ production: true }));
}

function zipPackage() {
    return src(['dist/**', '!dist/package.json', '!dist/package-lock.json'])
    .pipe(zip(outputName))
    .pipe(dest('dist/'));
}

function uploadToS3(cb) {
    const s3 = new AWS.S3();
    const zipFilePath = `dist/${outputName}`;

    return getZipFile((data) => {
        const params = {
            Bucket: bucketName,
            Key: `lambda/${outputName}`,
            Body: data
        };

        s3.putObject(params, async (err, data) => {
            if (err) console.log('Object upload unsuccessful!');
            else {
                console.log(`Object ${outputName} was uploaded!`);
                cb();
            }
        });
    });

    function getZipFile(next) {
        fs.readFile(zipFilePath, (err, data) => {
            if (err) console.log(err);
            else {
                next(data);
            }
        });
    }
}

function updateLambda(cb) {
    AWS.config.region = region;

    const lambda = new AWS.Lambda();
    const s3 = new AWS.S3();
    
    return lambda.getFunction({ FunctionName: functionName }, (err, data) => {
        if (err) checkObject(createFunction, cb);
        else checkObject(updateFunction, cb);
    });

    function checkObject(fn, cb) {
        const params = {
            Bucket: bucketName,
            Key: `lambda/${outputName}`
        };

        s3.getObject(params, (err, data) => {
            if (err) {
                console.log('Bucket error', err);
                cb();
            } else fn(cb);
        });
    }

    function createFunction(cb) {
        const params = {
            Code: {
                S3Bucket: bucketName,
                S3Key: `lambda/${outputName}`
            },
            FunctionName: functionName,
            Handler: 'Unzip.handler',
            Role: IAMRole,
            Runtime: 'nodejs10.x',
            Timeout: 60
        };

        lambda.createFunction(params, (err, data) => {
            if (err)console.log('Create error', err);
            else console.log(`Function ${functionName} has been created!`);

            cb();
        });
    }

    function updateFunction(cb) {
        const params = {
            FunctionName: functionName,
            S3Bucket: bucketName,
            S3Key: `lambda/${outputName}`
        };

        lambda.updateFunctionCode(params, (err, data) => {
            if (err) console.error(err);
            else console.log(`Function ${functionName} has been updated!`);

            cb();
        });
    }
}

exports.clean = clean;
exports.copy = copy;
exports.minify = minifyJs;
exports.install = installMods;
exports.zip = zipPackage;
exports.upload = uploadToS3;
exports.lambda = updateLambda;