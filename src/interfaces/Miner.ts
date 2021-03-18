export interface ActiverWorkers
{
    pagination: { size: number, page: number, totalPageCount: number },
    workers: [
        {
        statsTime: number,
        market: string,
        algorithm: { enumName: string, description: string },
        unpaidAmount: string,
        difficulty: number,
        proxyId: number,
        timeConnected: number,
        xnsub: boolean,
        speedAccepted: number,
        speedRejectedR1Target: number,
        speedRejectedR2Stale: number,
        speedRejectedR3Duplicate: number,
        speedRejectedR4NTime: number,
        speedRejectedR5Other: number,
        speedRejectedTotal: number,
        profitability: number,
        rigName: string
        }
    ]
}