import readline from "readline";

class CMDHandler
{
    
    private rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    public getInput(question: string, callback: (answer: string) => void): void
    {
        this.rl.question(question, (answer) => {
            callback(answer)
        });
    }

    public isPressed(
        hold: "ctrl" | "shift" | null,
        keys: string,
        callback: (isPressed: boolean) => void
    ): void
    {
        if(hold === "ctrl")
            process.stdin.on("keypress", (str, key) => {
                if(key.ctrl && key.name === keys)
                    callback(true)
                else
                    callback(false)
            });

        else if (hold === "shift")
            process.stdin.on("keypress", (str, key) => {
                if(key.shift && key.name === keys)
                    callback(true)
                else
                    callback(false)
            });

        else if (hold === null)
            process.stdin.on("keypress", (str, key) => {
                if(key.name === keys)
                    callback(true);
                else
                    callback(false)
            });

        else
            callback(false);
    }

    public clearScreen()
    {
        var lines = process.stdout.getWindowSize()[1];
        for(var i = 0; i < lines; i++) {
            console.log('\r\n');
        }
    }

    public notify(): void
    {
        console.log("\x07");
    }

    public close(): void
    {
        this.rl.close();
    }

}


export default CMDHandler;