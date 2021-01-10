import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayEventRequestContext
} from "aws-lambda";
import PageSpeedAnalyzer from "./PageSpeedAnalyzer";
import PageSpeedAnalyzeError from "./PageSpeedAnalyzeError";
import PageSpeedReport from "../model/PageSpeedReport";

module.exports.handle = async(event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext) : Promise<APIGatewayProxyResult> => {
  const targetPath : string = event.queryStringParameters.targetPath;

  const pageSpeedAnalyzer = new PageSpeedAnalyzer(process.env.PAGESPEED_INSIGHT_API_KEY);
  try {
    const report : PageSpeedReport|PageSpeedAnalyzeError = await pageSpeedAnalyzer.analyze(targetPath);
    if(report.status===200) {
      sendReport(report);
    }
    const response= {
      statusCode: report.status,
      body: JSON.stringify({
        report
      })
    };
    return response;

  } catch (e) {
    pageSpeedAnalyzer.cleanup();
    throw e;
  }
}

function sendReport(report: PageSpeedReport) {
  var AWS = require('aws-sdk');
  var sqs = new AWS.SQS();
  AWS.config.apiVersions = {
    sqs: '2012-11-05',
  };
  var params = {
    MessageBody: JSON.stringify({
      eventName: "raportCreatedEvent",
      report
    }),
    QueueUrl: process.env.PAGESPEED_INSIGHT_CHECKER_QUEUE
  };

  sqs.sendMessage(params, function (err: any, data: any) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.MessageId);
    }
  });
}