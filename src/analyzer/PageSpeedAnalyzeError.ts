class PageSpeedAnalyzeError {
    status: 500
    private reason: string;
    constructor(reason : string) {
        this.reason = reason;
    }
}

export default PageSpeedAnalyzeError;