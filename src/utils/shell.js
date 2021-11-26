async function sudoshell(cmd) {
    const Sudoer = require('@nathanielks/electron-sudo').default;
    const { options } = require('../global')

    var sudoer = new Sudoer(options);
    await sudoer.spawn(cmd);
}

async function ashell(cmd, args) {
    let spawn
    if (args == undefined) {
        spawn = require('child_process').exec
    } else
        spawn = require('child_process').spawn

    return await new Promise((resolve, reject) => {



        let ls = spawn(cmd, args);

        let output = "";

        ls.stdout.on('data', function(data) {
            //    console.log('stdout: ' + data.toString());
            output = data.toString();
        });

        ls.stderr.on('data', function(data) {
            //   console.log('stderr: ' + data.toString());
            output = data.toString()
        });

        ls.on('exit', function(code) {
            resolve(output.trim())
        });
    })

}


module.exports = { sudoshell, ashell }