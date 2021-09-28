var sudo = require('sudo-prompt');
const { branch, loc_aurora, ipcaction, fetchData, iprint } = require('../global')
const { existsSync } = require('fs');
const shell = require('async-shelljs');


async function updateCentre() {
    var currentversion, latestversion;

    await ipcaction('appversion').then((args) => {
        currentversion = args[0];
    });

    var uptext = document.getElementById("uptext");
    uptext.innerText = "v" + currentversion;
    if (window.navigator.onLine) {

        var modal = document.getElementById("update-modal");

        latestversion = (await fetchData("https://raw.githubusercontent.com/legacyO7/TUF-Aurora/" + branch + "/package.json", true)).version;

        if (currentversion != latestversion)
            console.log("everything up to date");
        else {
            modal.style.display = "block";
            document.getElementById('update-text').innerText = `v${latestversion}`;
        }

        document.getElementById("btn-close").onclick = function() {
            modal.style.display = "none";
        };
        document.getElementById("btn-update").onclick = function() {
            modal.style.display = "none";
            document.getElementById('appheader').style.marginLeft = "70px";
            document.getElementById('upbar').style.visibility = "visible";
            uptext.innerText = "Updating";

            doUpdate();
        };


        function doUpdate() {

            shell.asyncExec(`mkdir -p ${loc_aurora} && cd ${loc_aurora} && rm -rf temp && mkdir temp && cd temp && git clone --depth=1 https://github.com/legacyO7/TUF-Aurora.git -b ${branch} `).then(val => {

                const dialogoptions = {
                    type: 'question',
                    buttons: ['Yes, please', 'No, thanks'],
                    defaultId: 2,
                    title: 'Download Completed',
                    message: 'Download Completed',
                    detail: 'Update Now?',
                    checkboxChecked: false,
                };

                ipcaction('showdialog', [dialogoptions]).then((args) => {
                    if (args[0].response == 0) {
                        uptext.innerText = "Installing";
                        finalizeUpdate()
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

function finalizeUpdate() {
    shell.asyncExec(`xterm -maximized -e "cd ${loc_aurora}/temp/TUF-Aurora && echo > ../../.update && ./setup.sh && rm ../../.update "`).then(v => {
        if (!existsSync(`${loc_aurora}/.update`))
            window.close()
    })
}

module.exports = { updateCentre, finalizeUpdate }