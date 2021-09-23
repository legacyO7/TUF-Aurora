const { existsSync } = require('fs');
const { kModule, brightness, speed, kblMode } = require('../path');
const shell = require('shelljs');
const { ipcRenderer } = require('electron')

// check for faustus modules and load the configs on startup

const initialize = () => {
    if (existsSync(`${kModule}`)) {
        document.getElementById('content').style.display = 'block'
        document.getElementById('blockuser').style.display = 'none'
    } else {
        document.getElementById('content').style.display = 'none'
        document.getElementById('blockuser').style.display = 'block'
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