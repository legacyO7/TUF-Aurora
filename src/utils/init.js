const { existsSync } = require('fs');
const { kModule, brightness, speed, kblMode } = require('../path');
const shell = require('shelljs');
const { ipcRenderer } = require('electron')
const { loc_aurora, ipcaction, getchangelog, fetchData, saveDef, iprint, setkeyboardsettings } = require('../global')
const { VTexec } = require('open-term');
const paths = require('../path');

// check for faustus modules and load the configs on startup

const initialize = async() => {
    if (existsSync(`${kModule}`)) {
        document.getElementById('content').style.display = 'block'
        document.getElementById('blockuser').style.display = 'none'
    } else {
        document.getElementById('content').style.display = 'none'
        document.getElementById('blockuser').style.display = 'block'
    }

    await ipcaction('appversion').then(async(args) => {
        if (existsSync(`${loc_aurora}/v${args[0]}`)) {


        } else {
            shell.exec(`rm ${loc_aurora}/v*`)
            shell.exec(`echo > ${loc_aurora}/v${args[0]}`)
            var modal = document.getElementById("update-modal");
            var button = document.getElementById("btn-close");
            modal.style.display = "block";
            document.getElementById('modal-header').innerText = `Updated to v${args[0]}`
            document.getElementById('update-text').innerText = "What's new"
            getchangelog();
            button.innerText = " okay "
            button.onclick = function() {
                modal.style.display = "none";
            }
            document.getElementById("btn-update").style.display = "none"
        }
    })

    if (existsSync(`${loc_aurora}/.update`)) {

        const dialogoptions = {
            type: 'question',
            buttons: ['Update', 'Not now'],
            defaultId: 2,
            title: 'Its Update Time',
            message: 'Its Update Time! ',
            detail: 'update now',
            checkboxChecked: false,
        };

        ipcaction('showdialog', [dialogoptions]).then((args) => {
            if (args[0].response == 0) {
                VTexec(`${loc_aurora}/temp/TUF-Aurora/setup.sh`)
                shell.exec(`rm ${loc_aurora}/.update`)
                window.close()
            }
        })
    }


    if (!existsSync(`${loc_aurora}/config`)) {
        await saveDef()
    }

    //iprint(`k_${(await fetchData(`${loc_aurora}/config`, false)).speed}`)

    await fetchData(`${loc_aurora}/config`, false).then((value) => {
        document.getElementById(`k_${value.brightness}`).checked = true
        document.getElementById(`k_${value.speed}`).checked = true
        document.getElementById(`k_${value.mode}`).checked = true

        setkeyboardsettings(value.brightness)

        shell.exec(`echo "${value.brightness}" > ${paths.brightness}`);
        shell.exec('bash ' + __dirname + '/../shell/speed.sh ' + (parseInt(value.speed) - 4));
        shell.exec('bash ' + __dirname + '/../shell/mode.sh ' + (parseInt(value.mode) - 7));
    })

};

module.exports = { initialize };