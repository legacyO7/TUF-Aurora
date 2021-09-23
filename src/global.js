const { ipcRenderer } = require('electron')

var options = {
    name: 'Aurora',
};

var branch = "beta"

var loc_aurora = "~/.tuf-aurora"

const ipcaction = async(name, options) => {
    //  console.log(name)
    ipcRenderer.send(name, options);
    return await new Promise((resolve, reject) => {
        ipcRenderer.on(name + "-response", function(event, args) {
            resolve(args)
        });
    });
}


module.exports = { options, ipcaction, branch, loc_aurora }