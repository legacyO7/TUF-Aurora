const { ipcRenderer } = require('electron');
const { existsSync } = require('fs');
const untildify = require('untildify');
const { ashell } = require('./utils/shell');

var options = {
    name: 'Aurora',
};

async function branch() {
    return await ashell("git", ["rev-parse", "--abbrev-ref", "HEAD"])
}

var loc_aurora = untildify("~/.tuf-aurora");

const ipcaction = async(name, options) => {
    ipcRenderer.send(name, options);
    return await new Promise((resolve, reject) => {
        ipcRenderer.on(name + "-response", function(event, args) {
            resolve(args)
        });
    });
}

async function fetchData(url, changelog = false) {
    let response = await fetch(url);
    let data = await response.json();
    if (changelog)
        getchangelog();
    return data;
}

function getchangelog() {
    fetch("https://raw.githubusercontent.com/legacyO7/TUF-Aurora/" + branch + "/changelog.txt").then(async(r) => {
        document.getElementById('changelog').innerText = await r.text()
    })
}

async function saveDef(key, value) {
    var defaults
    if (existsSync(`${loc_aurora}/config`)) {
        defaults = await fetchData(`${loc_aurora}/config`, false)
    } else {
        await ashell("mkdir", ["-p", loc_aurora])
        defaults = { color: "#ffffff", mode: "7", speed: "4", brightness: "0" }
    }

    if (key != undefined)
        defaults[key] = value.toString();

    ashell("echo " + JSON.stringify(JSON.stringify(defaults)) + " > " + loc_aurora + "/config")
}

const setkeyboardsettings = (input) => {
    if (input == '0')
        state = 'none'
    else
        state = 'block'

    document.getElementById('speed').style.display = state
    document.getElementById('effects').style.display = state
    document.getElementById('colorpicker').style.display = state

    ipcRenderer.send('resize', [995, state == 'block' ? 710 : 500])
}

const disableSpeed = (id) => {
    let speed = document.getElementById("speed").style
    if (id === '7' || id === '10')
        speed.display = "none"
    else
        speed.display = "block"
}

module.exports = { options, ipcaction, branch, loc_aurora, getchangelog, saveDef, fetchData, setkeyboardsettings, disableSpeed }