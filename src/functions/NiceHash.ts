import { GetCurrentActiveWorkers } from "../lib/API";
import log from "../lib/Logger";

let NiceHash = {
    CurrentActiveWorkers: async () => {
        return new Promise((resolve, reject) => {
            GetCurrentActiveWorkers().then(r => {
                if(r.workers.length > 0)
                {
                    let paid = 0;
                    r.workers.forEach(worker => {
                        paid += parseFloat(worker.unpaidAmount);
                    });
                    log.info(`Unpaid amount: ${paid}`);
                    resolve(true)
                } else { log.info("No workers working right now.") }
            }).catch(e => {
                log.error(`An error accured..`);
            });
        })
    }
}

export default NiceHash;