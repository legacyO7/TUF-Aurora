const { config, which, exec } = require('shelljs');
config.execPath = which('node').toString();

const getdefvalue = async(path) => {
    return await new Promise((resolve, reject) => {
        exec(`cat ${path}`, function(
            error,
            stdout,
            stderr
        ) {
            resolve(stdout.replace(/\s+/g, ''))
        });
    });
}

module.exports = getdefvalue;