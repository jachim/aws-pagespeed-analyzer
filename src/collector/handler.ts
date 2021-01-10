import ReportCollector from "./ReportCollector";
import { SQSEvent } from "aws-lambda";
import PageSpeedReport from "../model/PageSpeedReport";

exports.handle = (event : SQSEvent, context : {}, callback : Function) => {

    const reportAnalyzer = new ReportCollector();
    event.Records.forEach((record : { [key: string]: any }) => {
        const report = <PageSpeedReport>JSON.parse(record.body).report;
        reportAnalyzer.process(report);
    } );

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'SQS event processed.',
            input: event,
        }),
    };

    callback(null, response);
};
