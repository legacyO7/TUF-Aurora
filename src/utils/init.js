const { existsSync } = require('fs');
const shell = require('async-shelljs');
const { ipcRenderer } = require('electron')
const { loc_aurora, ipcaction, getchangelog, fetchData, saveDef, iprint, setkeyboardsettings, branch, disableSpeed } = require('../global')
const paths = require('../path');
const { finalizeUpdate } = require('../components/updatecentre');
const { getPermission } = require('./permshandler');

// check for faustus modules and load the configs on startup

async function initialize() {

    var boot_status = document.getElementById('boot_status');
    boot_status.innerText = "SecureBoot disabled";
    if (shell.exec('mokutil --sb-state').includes('enabled')) {
        boot_status.style.color = 'greenyellow';
        boot_status.innerText = " SecureBoot enabled"
    }

    if (existsSync(`${paths.kModule}`)) {
        document.getElementById('content').style.display = 'block';
        document.getElementById('blockuser').style.display = 'none';


        if (!existsSync(`${loc_aurora}/config`)) {
            await saveDef();
        }


        await getPermission(paths.path_blue);
        await getPermission(paths.path_green);
        await getPermission(paths.path_red);

        await fetchData(`${loc_aurora}/config`, false).then(async(value) => {

            document.getElementById(`k_${value.brightness}`).click();
            document.getElementById(`k_${value.speed}`).click();
            document.getElementById(`k_${value.mode}`).click();

            setkeyboardsettings(value.brightness);
            disableSpeed(value.mode)

            shell.exec(`echo "${value.brightness}" > ${paths.brightness}`);
            shell.exec('bash ' + __dirname + '/../shell/speed.sh ' + (parseInt(value.speed) - 4));
            shell.exec('bash ' + __dirname + '/../shell/mode.sh ' + (parseInt(value.mode) - 7));
            shell.exec('bash ' + __dirname + `/../shell/color.sh ${value.color.substr(1, 2)} ${value.color.substr(3, 2)} ${value.color.substr(5, 2)}`);
        });

    } else {
        document.getElementById('content').style.display = 'none';
        document.getElementById('blockuser').style.display = 'block';
        ipcRenderer.send('resize', [720, 260]);
    }

    await ipcaction('appversion').then(async(args) => {
        if (existsSync(`${loc_aurora}/v${args[0]}`)) {} else {
            shell.exec(`rm ${loc_aurora}/v*`);
            shell.exec(`echo > ${loc_aurora}/v${args[0]}`);
            var modal = document.getElementById("update-modal");
            var button = document.getElementById("btn-close");
            modal.style.display = "block";
            document.getElementById('modal-header').innerText = `v${args[0]}`;
            document.getElementById('update-text').innerText = "What's new";
            getchangelog();
            button.innerText = " okay ";
            button.onclick = function() {
                modal.style.display = "none";
            };
            document.getElementById("btn-update").style.display = "none";
        }
    });

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
                finalizeUpdate();
            }
        });
    }

}

module.exports = { initialize };