const fs = require('fs');
const paths = require('../path');
const sudoPrompt = require('./sudoprompt');

// check for read or write perms in module directory and 
// request for sudo perms if it doesnt have perms

const permsHandler = async() => {

    await getPermission(paths.kModule);
    await getPermission(paths.path_blue);
    await getPermission(paths.path_green);
    await getPermission(paths.path_red);

};

const getPermission = async(path) => {
    return new Promise(function(resolve, reject) {
        fs.access(path, fs.constants.R_OK | fs.constants.W_OK, (err) => {
            if (err != null)
                sudoPrompt(path)
            resolve(err != null)

        });
    });
}

module.exports = permsHandler;