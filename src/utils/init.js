const { existsSync } = require('fs');
const { kModule, brightness, speed, kblMode } = require('../path');
const shell = require('shelljs');
const { ipcRenderer } = require('electron')
const { loc_aurora, ipcaction, branch } = require('../global')
const untildify = require('untildify');
const { VTexec } = require('open-term')

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
        if (existsSync(`${untildify(loc_aurora)}/v${args[0]}`)) {


        } else {
            shell.exec(`rm ${loc_aurora}/v*`)
            shell.exec(`echo > ${loc_aurora}/v${args[0]}`)
            var modal = document.getElementById("update-modal");
            var button = document.getElementById("btn-close");
            modal.style.display = "block";
            document.getElementById('modal-header').innerText = `Updated to v${args[0]}`
            document.getElementById('update-text').innerText = "What's new"
            fetch("https://raw.githubusercontent.com/legacyO7/TUF-Aurora/" + branch + "/changelog.txt").then(async(r) => {
                document.getElementById('changelog').innerText = await r.text()
            })
            button.innerText = " okay "
            button.onclick = function() {
                modal.style.display = "none";
            }
            document.getElementById("btn-update").style.display = "none"
        }
    })


    if (existsSync(`${untildify(loc_aurora)}/.update`)) {

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

    document.getElementById(parseInt(shell.exec(`cat ${brightness}`)), 0).checked = true
    document.getElementById(4 + parseInt(shell.exec(`cat ${speed}`)), 0).checked = true
    document.getElementById(7 + parseInt(shell.exec(`cat ${kblMode}`)), 0).checked = true

    setkeyboardsettings(parseInt(shell.exec(`cat ${brightness}`)))


};

const setkeyboardsettings = (input) => {
    if (input == 0)
        state = 'none'
    else
        state = 'block'

    document.getElementById('speed').style.display = state
    document.getElementById('effects').style.display = state
    document.getElementById('colorpicker').style.display = state

    ipcRenderer.send('resize', [995, state == 'block' ? 710 : 500])
}

module.exports = { initialize, setkeyboardsettings };