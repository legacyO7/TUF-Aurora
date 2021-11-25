const paths = require('../path');
const Sudoer = require('@nathanielks/electron-sudo').default;
const { options, ipcaction } = require('../global');
const { existsSync } = require('fs');
const { ashell } = require('../utils/shell');


const setup = () => {

    $('#pi').on('click', () => {
        execShell('pi')
    })

    $('#fi').on('click', () => {
        extermExec("fi")
    })
}

const extermExec = (val) => {
    ashell(`xterm  -e "${__dirname}/../../setup_minimal.sh ${val}"`).then((resp => {

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

    let modal, logcat, butonstatus, buttontext, btnclose;

    let cp = await sudoer.spawn(
        __dirname + '/../../setup_minimal.sh ' + val
    );

    if (val == "update") {
        modal = document.getElementById("update-modal");
        logcat = document.getElementById('changelog');
        btnclose = document.getElementById("btn-close");
        btnclose.innerText = "Close";
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
            logcat.style.color = "green";
            process = true;
        }
        logcat.innerText += data.toString();
    });

    cp.on('close', () => {
        btnclose.style.display = "block";
        if (val == "update") {
            if (process) {
                ipcaction("restart");
            } else {
                btnclose.onclick = function() {
                    modal.style.display = "none";
                };
            }
        } else {
            butonstatus.style.display = "block";
            if (process) {
                buttontext.style.color = "#266EF6";
                butonstatus.innerHTML = "&#10003;";
                modal.style.display = "none";
                document.getElementById("fi").style.display = "block";
            } else {
                buttontext.style.color = "red";
                butonstatus.innerHTML = "&#10005;";
                btnclose.onclick = function() {
                    modal.style.display = "none";
                };
            }
        }

    });
}

setup()

module.exports = execShell