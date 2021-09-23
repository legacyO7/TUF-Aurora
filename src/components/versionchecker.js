const { ipcRenderer, dialog } = require('electron')
var sudo = require('sudo-prompt');
var { exec } = require('child_process');
const { VTexec } = require('open-term')
const { options, showdialog: ipcaction } = require('../global')
const shell = require('shelljs');


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

        latestvesrion = await getlatestvesrion("https://raw.githubusercontent.com/legacyO7/TUF-Aurora/master/package.json")

        if (currentversion != latestvesrion)
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
            doUpdate()
        }


        async function doUpdate() {
            document.getElementById('appheader').style.marginLeft = "70px"
            document.getElementById('upbar').style.visibility = "visible"
            uptext.innerText = "Updating"
            modal.style.display = "none";

            shell.exec('rm -rf temp && mkdir temp && cd temp  && git clone https://github.com/legacyO7/TUF-Aurora.git')

            const dialogoptions = {
                type: 'question',
                buttons: ['Yes, please'],
                defaultId: 2,
                title: 'Download Completed',
                message: 'Download Completed',
                detail: 'Close the app and update now',
                checkboxChecked: false,
            };

            await ipcaction('showdialog', [dialogoptions]).then((args) => {
                if (args[0].response == 0) {
                    VTexec('bash TUF-Aurora/setup.sh')
                    window.close()
                }
            })

        }

    }


}


module.exports = updatechecker