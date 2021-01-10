import PageSpeedReport from "../model/PageSpeedReport";
import DynamoDBReportRepository from "./db/DynamoDBReportRepository";
import ReportRepository from "../model/PageSpeedReportRepository";

class ReportCollector {

    private reportRepository : ReportRepository;

    constructor() {
        this.reportRepository = new DynamoDBReportRepository();
    }

    process(report : PageSpeedReport) : void {
        this.reportRepository.saveReport(report);
    }

}

export default ReportCollector;