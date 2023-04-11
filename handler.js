"use strict";
const AWS = require("aws-sdk");
const util = require("util");
const stream = require("stream");
const pipeline = util.promisify(stream.pipeline);

AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();

module.exports.downloadPdf = awslambda.streamifyResponse(async (event, responseStream, context) => {
  const params = {
    Bucket: "lambda-response-stream-1234",
    Key: "Test_Data_10.5MB_PDF.pdf",
  };
  console.log("Creating a S3 ReadStream");
  const requestStream = s3.getObject(params).createReadStream();
  const metadata = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/pdf",
    },
  };
  console.log("Streaming PDF file via function URL");
  responseStream = awslambda.HttpResponseStream.from(responseStream, metadata);

  await pipeline(requestStream, responseStream);
});