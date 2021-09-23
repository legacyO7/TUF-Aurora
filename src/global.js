const { ipcRenderer } = require('electron')

var options = {
    name: 'Aurora',
};

var branch = "master"

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

function getchangelog() {
    fetch("https://raw.githubusercontent.com/legacyO7/TUF-Aurora/" + branch + "/changelog.txt").then(async(r) => {
        document.getElementById('changelog').innerText = await r.text()
    })
}


module.exports = { options, ipcaction, branch, loc_aurora, getchangelog }
