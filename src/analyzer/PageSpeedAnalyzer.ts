import PageSpeedAnalyzeError from "./PageSpeedAnalyzeError";
import PageSpeedReport from "../model/PageSpeedReport";
const fetch = require("node-fetch");


class PageSpeedAnalyzer {

    private readonly apiKey: string;

    constructor(apiKey : string) {
        this.apiKey = apiKey;
    }

    async analyze(url : string) : Promise<PageSpeedReport|PageSpeedAnalyzeError> {
        const analyzeUrl = this.setUpQuery(url);
        const metrics = await fetch(analyzeUrl)
            .then((response : any) => {
              if(response.status!==200) {
                  throw "Something went wrong, status code: "+response.stautus+" for url "+response.url;
              }
              return response.json();
            })
            .then((json : {[key: string] : any}) => {
                const lighthouse = json.lighthouseResult;
                return {
                    "FCP": json.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category,
                    "FID": json.loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category,
                    'FIP': lighthouse.audits['first-contentful-paint'].displayValue,
                    'SI': lighthouse.audits['speed-index'].displayValue,
                    'TTI': lighthouse.audits['interactive'].displayValue,
                    'FMP': lighthouse.audits['first-meaningful-paint'].displayValue,
                    'FCI': lighthouse.audits['first-cpu-idle'].displayValue,
                    'EIL': lighthouse.audits['estimated-input-latency'].displayValue
                };

            })
            .catch((err : any) => {
                return new PageSpeedAnalyzeError(err);
            })

            return <PageSpeedReport>{
                status: 200,
                firstContentfulPaint: metrics.FCP,
                firstInputDelay: metrics.FID,
                speedIndex: metrics.SI,
                timeToInteractive: metrics.TTI,
                firstMeaningfulPaint: metrics.FMP,
                firstCpuIdle: metrics.FCI,
                estimatedInputLatency: metrics.EIL,
            }

    }

    setUpQuery(url : string) : string {
        const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
        const parameters = {
            url: encodeURIComponent(url),
            key: this.apiKey
        };
        let query = `${api}?`;

        query += `url=${parameters.url}&key=${parameters.key}`;
        return query;
    }

    cleanup() {

    }
}

export default PageSpeedAnalyzer;