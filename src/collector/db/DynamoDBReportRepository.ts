const uuid = require('uuid');
import ReportRepository from "./../../model/PageSpeedReportRepository";
import PageSpeedReport from "./../../model/PageSpeedReport";
import {DocumentClient} from "aws-sdk/clients/dynamodb";
const AWS = require('aws-sdk');

class DynamoDBReportRepository implements ReportRepository {

    private dynamoDb: DocumentClient;

    constructor() {
        this.dynamoDb = new AWS.DynamoDB.DocumentClient();
    }

    saveReport(report: PageSpeedReport): void {
        const timestamp = new Date().getTime();
        const params = {
            TableName: "PageSpeedReports",
            Item: {
                id: uuid.v1(),
                report: report,
                createdAt: timestamp,
                updatedAt: timestamp,
            },
        };

        this.dynamoDb.put(params, (error) => {});
    }

}

export default DynamoDBReportRepository;