import colors from "colors";
import dateFormat from "date-and-time";

const log = {
    trace: trace,

    debug: (body: any, trace = '') => {
        if(process.env.DEBUG === 'true') {
            let line, lines;
            if(trace.length > 0)
            {
                line = trace;
                lines = line.split("\n")
            }

            let time = getTime()

            console.log(time + " | " + colors.cyan(`debug: ${body}`) 
            //@ts-ignore
            + " ", + trace.length > 0 ? lines[2].substring(lines[2].indexOf("("), lines[2].lastIndexOf(")") + 1) : '');
        }
    },

    verbos: (body: any, trace = '') => {
        let line, lines;
        if(trace.length > 0)
        {
            line = trace;
            lines = line.split("\n")
        }

        let time = getTime()

        console.log(time + " | " + colors.magenta(`verbos: ${body}`)
        //@ts-ignore
        + " ", + trace.length > 0 ? lines[2].substring(lines[2].indexOf("("), lines[2].lastIndexOf(")") + 1) : '');
    },

    error: (body: any, trace = '') => {
        let line, lines;
        if(trace.length > 0)
        {
            line = trace;
            lines = line.split("\n")
        }

        let time = getTime()

        console.log(time + " | " + colors.red(`error: ${body}`)
        //@ts-ignore
        + " ", + trace.length > 0 ? lines[2].substring(lines[2].indexOf("("), lines[2].lastIndexOf(")") + 1) : '');
    },

    warning: (body: any, trace = '') => {
        let line, lines;
        if(trace.length > 0)
        {
            line = trace;
            lines = line.split("\n")
        }

        let time = getTime()

        console.log(time + " | " + colors.yellow(`warning: ${body}`)
        //@ts-ignore
        + " ", + trace.length > 0 ? lines[2].substring(lines[2].indexOf("("), lines[2].lastIndexOf(")") + 1) : '');
    },

    info: (body: any, trace = '') => {
        let line, lines;
        if(trace.length > 0)
        {
            line = trace;
            lines = line.split("\n")
        }

        let time = getTime()

        console.log(time + " | " + colors.blue(`info: ${body}`)
        //@ts-ignore
        + " ", + trace.length > 0 ? lines[2].substring(lines[2].indexOf("("), lines[2].lastIndexOf(")") + 1) : '');
    },
}

function trace()
{
    var err = new Error();
    return err.stack;
}

function getTime() 
{
    const D_CurrentDate = new Date();

    let S_FixedDate = dateFormat.format(D_CurrentDate, "YYYY-MM-DD HH:mm:ss");
    return S_FixedDate;
}

export default log;