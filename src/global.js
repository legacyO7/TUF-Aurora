const { ipcRenderer } = require('electron')

var options = {
    name: 'Aurora',
};

const showdialog = async(name, options) => {
    //  console.log(name)
    ipcRenderer.send(name, options);
    return await new Promise((resolve, reject) => {
        ipcRenderer.on(name + "-response", function(event, args) {
            resolve(args)
        });
    });
}


module.exports = { options, showdialog }