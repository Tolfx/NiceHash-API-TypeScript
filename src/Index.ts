require("dotenv").config();
import { Webhook } from "discord.js";
import { Version } from "./Config";
import { stripIndent } from "common-tags";
import { Account2Balance, AccountDepositAddress, GetCurrentActiveWorkers, AccountWithdraw } from "./lib/API";

console.log(`Current version: ${Version}`);
console.log(stripIndent`
+--------+  +----+  +        +------+  X     X
    ||      |    |  |        |          X   X
    ||      |    |  |        +---+       X X
    ||      |    |  |        |            X
    ||      |    |  |        |           X X
    ||      |    |  |        |          X   X
    ++      +----+  +-----+  +         X     X`);

GetCurrentActiveWorkers().then(r => {
    r.workers.forEach(worker => {
        console.log(`Unpaid amounts = ` + worker.unpaidAmount);
        console.log(`Profit = ` + worker.profitability);
    });
}).catch(e => {
    console.log(e)
})