const { existsSync } = require('fs');
const { ipcRenderer } = require('electron')
const { loc_aurora, ipcaction, getchangelog, fetchData, saveDef, setkeyboardsettings, disableSpeed, shelldir } = require('../global')
const paths = require('../path');
const { finalizeUpdate } = require('../components/updatecentre');
const { getPermission } = require('./permshandler');
const { ashell } = require('./shell');

// check for faustus modules and load the configs on startup

async function initialize() {


    var boot_status = document.getElementById('boot_status');
    boot_status.innerText = await ashell('mokutil', ['--sb-state'])
    if (boot_status.innerText.includes('enabled')) {
        boot_status.style.color = 'greenyellow'
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

            document.getElementById(`k_${value.brightness}`).click();;
            document.getElementById(`k_${value.speed}`).click();
            document.getElementById(`k_${value.mode}`).click();

            document.getElementById(`l_${value.brightness}`).classList.add("card")
            document.getElementById(`l_${value.speed}`).classList.add("card")
            document.getElementById(`l_${value.mode}`).classList.add("card")

            setkeyboardsettings(value.brightness);
            disableSpeed(value.mode)
            let dir = await shelldir()

            ashell(`echo "${value.brightness}" > ${paths.brightness}`);
            ashell('bash ' + dir + '/speed.sh ' + (parseInt(value.speed) - 4));
            ashell('bash ' + dir + '/mode.sh ' + (parseInt(value.mode) - 7));
            ashell('bash ' + dir + `/color.sh ${value.color.substr(1, 2)} ${value.color.substr(3, 2)} ${value.color.substr(5, 2)}`);
        });

    } else {
        document.getElementById('content').style.display = 'none';
        document.getElementById('blockuser').style.display = 'block';
        ipcRenderer.send('resize', [720, 260]);
    }

    await ipcaction('appversion').then(async(args) => {
        if (existsSync(`${loc_aurora}/v${args[0]}`)) {} else {
            ashell(`rm ${loc_aurora}/v*`);
            ashell(`echo > ${loc_aurora}/v${args[0]}`);
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