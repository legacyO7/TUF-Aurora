const { ipcRenderer, dialog } = require('electron')
var sudo = require('sudo-prompt');
var { exec } = require('child_process');
const { VTexec } = require('open-term')
const { options, showdialog: ipcaction } = require('../global')
const shell = require('async-shelljs');

var spawn = require('child_process').spawn;



async function getlatestvesrion(url) {
    let response = await fetch(url);
    let data = await response.json();
    fetch("https://raw.githubusercontent.com/legacyO7/TUF-Aurora/beta/changelog.txt").then((r) => {
        r.text().then((d) => {
            document.getElementById('changelog').innerText = d
        })
    })
    return data.version;
}

const updatechecker = async() => {
    var currentversion, latestvesrion

    await ipcaction('appversion').then((args) => {
        currentversion = args[0]
    })

    var uptext = document.getElementById("uptext")
    uptext.innerText = "v" + currentversion
    if (window.navigator.onLine) {

        var modal = document.getElementById("update-modal");

        latestvesrion = await getlatestvesrion("https://raw.githubusercontent.com/legacyO7/TUF-Aurora/beta/package.json")


        if (currentversion == latestvesrion)
            console.log("everything up to date")
        else {
            modal.style.display = "block";
            document.getElementById('update-text').innerText = `v${latestvesrion}`
        }

        shell.exec('rm -rf temp')

        document.getElementById("btn-close").onclick = function() {
            modal.style.display = "none";
        }
        document.getElementById("btn-update").onclick = function() {
            modal.style.display = "none";
            document.getElementById('appheader').style.marginLeft = "70px"
            document.getElementById('upbar').style.visibility = "visible"
            uptext.innerText = "Updating"

            doUpdate()

        }


        function doUpdate() {

            console.log("updating")

            shell.asyncExec('mkdir -p ~/.tuf-aurora && cd ~/.tuf-aurora && rm -rf temp && mkdir temp && cd temp && git clone --depth=1 https://github.com/legacyO7/TUF-Aurora.git').then(val => {

                const dialogoptions = {
                    type: 'question',
                    buttons: ['Yes, please'],
                    defaultId: 1,
                    title: 'Download Completed',
                    message: 'Download Completed',
                    detail: 'Close the app and update now',
                    checkboxChecked: false,
                };

                ipcaction('showdialog', [dialogoptions]).then((args) => {
                    if (args[0].response == 0) {
                        VTexec('~/.tuf-aurora/temp/TUF-Aurora/setup.sh')
                        window.close()
                    }
                })
            })

        }

    }


}


module.exports = updatechecker