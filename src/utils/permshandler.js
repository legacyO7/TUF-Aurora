const fs = require('fs');
const paths = require('../path');
const { sudoshell } = require('./shell');

// check for read or write permissions in module directory and 
// request for sudo permission if it doesnt have permission

async function permsHandler() {

    await getPermission(paths.kModule);

}

async function getPermission(path) {
    return new Promise(function(resolve, reject) {
        fs.access(path, fs.constants.R_OK | fs.constants.W_OK, (err) => {
            if (err != null)
                sudoshell(`chmod -R o+rwx ${path}`)
            resolve(err != null);
        });
    });
}

module.exports = { permsHandler, getPermission };