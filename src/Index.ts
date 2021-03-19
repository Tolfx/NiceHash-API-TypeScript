require("dotenv").config();
import { Webhook } from "discord.js";
import { Version, API_Key, Secret_API_Key } from "./Config";
import { stripIndent } from "common-tags";
import log from "./lib/Logger";
import CMDHandler from "./CMD/Handler";
import NiceHash from "./functions/NiceHash";
import Loop_NiceHash from "./functions/Loop-NiceHash";

if(API_Key == "" || Secret_API_Key == "")
{
    console.log(`Please ensure that you have insert all credentials.`);
    process.exit(0);
}

log.verbos("\n" + stripIndent`
+--------+  +----+  +        +------+  X     X    +--------+   +------x
    ||      |    |  |        |          X   X         ||       |
    ||      |    |  |        +---+       X X          ||       +---x
    ||      |    |  |        |            X           ||       |
    ||      |    |  |        |           X X          ||       |
    ||      |    |  |        |          X   X         ||       |
    ++      +----+  +-----+  +         X     X   XX   ++       +`);
log.info(`Current version: ${Version}`);
let cmd = new CMDHandler();

function closeLoop(i: NodeJS.Timeout): void
{
    cmd.isPressed("ctrl", "x", (ispressed) => {

        if(ispressed)
        {
            log.verbos(`Closing down loop..`)
            clearInterval(i)
            start();
        }
    });
}

function start()
{
    let startMenu = "\n" + stripIndent`
    --l [number] : Loops ever second depending on the number

    (1) : Show total unpaid.
    (2) : Clear screen.

    Option:
    ` + " ";

    cmd.getInput(startMenu, async (a) => {
        // Check for loop.
        if(a.includes("--l"))
        {
            let indexOfLoop = a.indexOf("--l");
            let temp = a;
            temp = temp.substring(indexOfLoop);
            temp = temp.split(" ")[1];
            if(parseInt(temp) < 5) {

                log.error(`Please enter an number higher than 5`);
                return start();
            }
            else

            switch(a.split(" ")[0])
            {
                case "1": {
                    let i = await Loop_NiceHash.CurrentActiveWorkers(parseInt(temp)*1000);
                    log.info(`Stop by holding CTRL+X`);
                    closeLoop(i);
                    break;
                }
                case "2": cmd.clearScreen(); start(); break;

                default: log.error(`Invalid option..`); start(); break;
            }
            

        }

        else
            switch(a)
            {
                case "1": await NiceHash.CurrentActiveWorkers(); cmd.notify(); start(); break;
                case "2": cmd.clearScreen(); start(); break;


                default: log.error(`Invalid option..`); start(); break;
            }
    });
}

start()