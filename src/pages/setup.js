const paths = require('../path');
const Sudoer = require('@nathanielks/electron-sudo').default;
const { options, ipcaction, accentColor, shelldir } = require('../global');
const { existsSync } = require('fs');
const { ashell, sudoshell } = require('../utils/shell');

let dir

const setup = async() => {

    dir = await shelldir()

    $('#pi').on('click', () => {
        execShell('pi')
    })

    $('#fi').on('click', () => {
        extermExec("fi")
    })
}

const extermExec = (val) => {
    ashell(`xterm  -e "${dir}/../../setup_minimal.sh ${val}"`).then((resp => {

        let buttontext = document.getElementById(val + '-title')
        let butonstatus = document.getElementById(val + '-status')
        butonstatus.style.display = "block"

        if (existsSync(`${paths.kModule}`)) {
            document.getElementById("load").style.display = "block"
            buttontext.style.color = "#266EF6"
            butonstatus.innerHTML = "&#10003;"
            setTimeout(function() {
                window.location.href = './home.html';
            }, 3000);

        } else {
            buttontext.style.color = "red"
            butonstatus.innerHTML = "&#10005;"
        }
    }))
}


async function execShell(val) {
    var sudoer = new Sudoer(options);
    let process = true;


    let modal, logcat, butonstatus, buttontext, btnclose, downicon, actionCompleted = false;

    let cp = await sudoer.spawn(
        dir + '/../../setup_minimal.sh ' + val
    );

    return new Promise((resolve, reject) => {

        if (val == "update") {
            downicon = document.getElementById("downicon")
            modal = document.getElementById("update-modal");
            logcat = document.getElementById('changelog');
            btnclose = document.getElementById("btn-close");
            document.getElementById('modal-scroll').style.flexDirection = "column-reverse"
            btnclose.innerText = "Close";
            btnclose.style.display = "block";
            btnclose.onclick = function() {

                modal.style.display = "none";
                if (!actionCompleted)
                    downicon.style.display = "block"

            };
            downicon.onclick = function() {
                modal.style.display = "block";
                downicon.style.display = "none"
            };
        } else {
            modal = document.getElementById("log");
            logcat = document.getElementById('log-text');
            buttontext = document.getElementById(val + '-title');
            butonstatus = document.getElementById(val + '-status');
            btnclose = document.getElementById("log-close");
            modal.style.display = "block";
        }

        logcat.innerText = "";

        cp.stdout.on('data', function(data) {
            logcat.innerText += data.toString();

        });

        cp.stderr.on('data', function(data) {
            if (!data.includes('awaiting response')) {
                logcat.style.color = "red";
                process = false;
            } else {
                logcat.style.color = accentColor;
                process = true;
            }
            logcat.innerText += data.toString();
        });

        cp.on('close', () => {
            actionCompleted = true

            logcat.innerText += "cp " + dir + '/../../* ~/.tuf-aurora'

            if (val == "update") {
                downicon.style.display = "none"
                if (process) {
                    ipcaction("restart");
                }
            } else {
                butonstatus.style.display = "block";
                if (process) {
                    buttontext.style.color = "#266EF6";
                    butonstatus.innerHTML = "&#10003;";
                    modal.style.display = "none";
                    document.getElementById("fi").style.display = "block";
                } else {
                    btnclose.style.display = "block";
                    buttontext.style.color = "red";
                    butonstatus.innerHTML = "&#10005;";
                    btnclose.onclick = function() {
                        modal.style.display = "none";
                    };
                }
            }
            resolve("done")
        });

    })
}

setup()

module.exports = execShell