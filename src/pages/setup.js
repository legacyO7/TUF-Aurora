const getdefvalue = require('../utils/getdefaults');
const paths = require('../path');
const shell = require('async-shelljs');
const Sudoer = require('@nathanielks/electron-sudo').default;
const { options } = require('../global');
const { existsSync } = require('fs');


const setup = () => {

    document.getElementById("fi").style.display = "block"

    $('#pi').on('click', () => {
        execShell('pi')
    })

    $('#fi').on('click', () => {
        extermExec("fi")
    })
}

const extermExec = (val) => {
    shell.asyncExec(`xterm  -e "${__dirname}/../../setup_minimal.sh ${val}"`).then((resp => {

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


const execShell = async(val) => {

    var sudoer = new Sudoer(options);
    let process = true;

    let cp = await sudoer.spawn(
        __dirname + '/../../setup_minimal.sh ' + val,
    );

    let modal = document.getElementById("log");
    let logcat = document.getElementById('log-text');
    let buttontext = document.getElementById(val + '-title')
    let butonstatus = document.getElementById(val + '-status')
    modal.style.display = "block";

    logcat.innerText = ""

    cp.stdout.on('data', function(data) {
        logcat.innerText += data.toString();
    });

    cp.stderr.on('data', function(data) {
        logcat.style.color = "red"
        process = false
        logcat.innerText += data.toString();
    });

    cp.on('close', () => {
        butonstatus.style.display = "block"
        if (process) {
            buttontext.style.color = "#266EF6"
            butonstatus.innerHTML = "&#10003;"
            modal.style.display = "none";
            if (val == "pi")
                document.getElementById("fi").style.display = "block"

        } else {
            let btnclose = document.getElementById("log-close")
            buttontext.style.color = "red"
            butonstatus.innerHTML = "&#10005;"
            btnclose.style.display = "block"
            btnclose.onclick = function() {
                modal.style.display = "none";
            };
        }

    });
}

setup()