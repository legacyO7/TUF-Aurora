const { ipcRenderer, dialog } = require('electron')
var sudo = require('sudo-prompt');
var { exec } = require('child_process');
const { VTexec } = require('open-term')
const shell = require('shelljs');


var options = {
    name: 'Aurora',
};

async function getlatestvesrion(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data.version;
}

async function execWaitForOutput(command, execOptions = {}) {
    return new Promise((resolve, reject) => {
        const childProcess = exec('git pull', execOptions);

        // stream process output to console
        childProcess.stderr.on('data', data => console.error(data));
        childProcess.stdout.on('data', data => console.log(data));
        // handle exit
        childProcess.on('exit', () => resolve());
        childProcess.on('close', () => resolve());
        // handle errors
        childProcess.on('error', error => reject(error));
    })
}

const updatechecker = async() => {

    var currentversion, latestvesrion
    ipcRenderer.send('appversion');
    ipcRenderer.on('appversion-response', function(event, args) {
        currentversion = args[0]
    });

    var modal = document.getElementById("update-modal");

    latestvesrion = (await getlatestvesrion("https://raw.githubusercontent.com/legacyO7/TUF-Aurora/master/package.json"))

    if (currentversion == latestvesrion)
        console.log("everything up to date")
    else {
        modal.style.display = "block";
        document.getElementById('update-text').innerText = `v${latestvesrion}`
    }

    //shell.exec('rm -rf temp')

    document.getElementById("btn-close").onclick = function() {
        modal.style.display = "none";
    }
    document.getElementById("btn-update").onclick = function() {
        modal.style.display = "none";
        console.log('downloading sources')
        shell.exec('rm -rf temp && mkdir temp && cd temp  && git clone https://github.com/legacyO7/TUF-Aurora.git')
        console.log('downloading completed')


        const dialogoptions = {
            type: 'question',
            buttons: ['Yes, please'],
            defaultId: 2,
            title: 'Download Completed',
            message: 'Download Completed',
            detail: 'Do you want to close the app and update now?',
            checkboxChecked: false,
        };


        ipcRenderer.send('showdialog', [dialogoptions]);
        ipcRenderer.on('dialog-response', function(event, args) {
            if (args[0].response == 0) {
                VTexec('bash TUF-Aurora/setup.sh')
                window.close()
            }
        });
    }

}


module.exports = updatechecker