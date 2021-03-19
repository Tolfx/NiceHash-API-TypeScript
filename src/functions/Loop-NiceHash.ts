import { GetCurrentActiveWorkers } from "../lib/API";
import log from "../lib/Logger";

let Loop_NiceHash = {
    CurrentActiveWorkers: async (loop: number): Promise<NodeJS.Timeout> => {
        return new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                GetCurrentActiveWorkers().then(r => {
                    if(r.workers.length > 0)
                    {
                        let paid = 0;
                        r.workers.forEach(worker => {
                            paid += parseFloat(worker.unpaidAmount);
                        });
                        log.info(`Unpaid amount: ${paid}`);
                    } else { log.info("No workers working right now.") }
                }).catch(e => {
                    log.error(`An error accured..`);
                });
            }, loop);
            resolve(interval);
        })
    }
}

export default Loop_NiceHash;