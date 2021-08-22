const fs = require('fs');
const paths = require('../path');
const sudoPrompt = require('./sudoprompt');

// check for read or write perms in module directory and 
// request for sudo perms if it doesnt have perms

const permsHandler = async() => {

    if (await getPermission(paths.kModule))
        sudoPrompt();

};

const getPermission = async(path) => {
    return new Promise(function(resolve, reject) {
        fs.access(path, fs.constants.R_OK | fs.constants.W_OK, (err) => {
            resolve(err != null)

        });
    });
}

module.exports = permsHandler;