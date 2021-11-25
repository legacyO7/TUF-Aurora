async function ashell(cmd, args) {


    return await new Promise((resolve, reject) => {

        var spawn
        if (args == undefined) {
            spawn = require('child_process').exec
        } else
            spawn = require('child_process').spawn


        let ls = spawn(cmd, args);

        let output = "";

        ls.stdout.on('data', function(data) {
            //    console.log('stdout: ' + data.toString());
            output = data.toString();
        });

        ls.stderr.on('data', function(data) {
            //    console.log('stderr: ' + data.toString());
            output = data.toString()
        });

        ls.on('exit', function(code) {
            resolve(output.trim())
        });
    })

}


module.exports = ashell