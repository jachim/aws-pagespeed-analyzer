interface PageSpeedReport {
        status: number,
        firstContentfulPaint: string,
        firstInputDelay: string,
        speedIndex: string,
        timeToInteractive: string,
        firstMeaningfulPaint: string,
        firstCpuIdle: string,
        estimatedInputLatency: string,
}

export default PageSpeedReport;