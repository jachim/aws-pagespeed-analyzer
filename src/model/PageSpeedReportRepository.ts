import PageSpeedReport from "./PageSpeedReport";

interface PageSpeedReportRepository {
    saveReport(report : PageSpeedReport) : void;
}

export default PageSpeedReportRepository;