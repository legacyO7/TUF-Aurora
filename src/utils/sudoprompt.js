const sudo = require('sudo-prompt');
const paths = require('../path');

const options = {
    name: 'Electron',
};
const sudoPrompt = (path) => {

    sudo.exec(`chmod -R o+rwx ${path}`, options, (error, stdout, stderr) => {
        if (error) throw error;
        console.log('stdout: ' + stdout);
    });
};
module.exports = sudoPrompt;