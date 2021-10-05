const { spawn } = require("child_process");

const exec = async(cmd, args, excmd) => {

    let arg = [];
    if (args != undefined)
        arg.push(args.split(' '))
    if (excmd != undefined)
        arg.push(excmd)

    return await new Promise((resolve, reject) => {
        console.log(arg)
        const ls = spawn(`xterm`, ['-e' ["ls"]]);

        ls.stdout.on("data", data => {
            console.log(`stdout: ${data}`);
            resolve(data.toString())
            resp = data.toString()
        });

        ls.stderr.on("data", data => {
            console.log(`stderr: ${data}`);
            resp = "err : " + data
            resolve(data.toString())
        });

        ls.on('error', (error) => {
            console.log(`error: ${error.message}`);
            resp = "error : " + error
            resolve(error.toString())
        });
    });
}

module.exports = { exec }