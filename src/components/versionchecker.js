const { ipcRenderer, dialog } = require('electron')
const { VTexec } = require('open-term')
const { branch, ipcaction, loc_aurora } = require('../global')
const shell = require('async-shelljs');

async function getlatestvesrion(url) {
    let response = await fetch(url);
    let data = await response.json();
    fetch("https://raw.githubusercontent.com/legacyO7/TUF-Aurora/" + branch + "/changelog.txt").then(async(r) => {
        document.getElementById('changelog').innerText = await r.text()
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

        latestvesrion = await getlatestvesrion("https://raw.githubusercontent.com/legacyO7/TUF-Aurora/" + branch + "/package.json")

        if (currentversion == latestvesrion)
            console.log("everything up to date")
        else {
            modal.style.display = "block";
            document.getElementById('update-text').innerText = `v${latestvesrion}`
        }

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

            shell.asyncExec(`mkdir -p ${loc_aurora} && cd ${loc_aurora} && rm -rf temp && mkdir temp && cd temp && git clone --depth=1 https://github.com/legacyO7/TUF-Aurora.git -b ${branch}`).then(val => {

                const dialogoptions = {
                    type: 'question',
                    buttons: ['Yes, please', 'No, thanks'],
                    defaultId: 2,
                    title: 'Download Completed',
                    message: 'Download Completed',
                    detail: 'Close the app and update now',
                    checkboxChecked: false,
                };

                ipcaction('showdialog', [dialogoptions]).then((args) => {
                    if (args[0].response == 0) {
                        VTexec(`${loc_aurora}/temp/TUF-Aurora/setup.sh`)
                        window.close()
                    } else {
                        shell.exec(`echo > ${loc_aurora}/.update`)
                        document.getElementById('appheader').style.marginLeft = "30px"
                        document.getElementById('upbar').style.visibility = "hidden"
                        uptext.innerText = "v" + currentversion
                    }
                })
            })

        }

    }


}


module.exports = updatechecker