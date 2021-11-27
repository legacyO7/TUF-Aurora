const { ipcRenderer } = require('electron');
const { existsSync } = require('fs');
const untildify = require('untildify');
const { ashell } = require('./utils/shell');

var options = {
    name: 'Aurora',
};

var loc_aurora = untildify("~/.tuf-aurora");

var accentColor = "#266EF6"


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
    fetch("https://raw.githubusercontent.com/legacyO7/TUF-Aurora/master/changelog.txt").then(async(r) => {
        let changelog = document.getElementById('changelog')
        changelog.innerText = await r.text()
        if (changelog.innerText.includes("404"))
            document.getElementById('update-modal').style.display = "none"

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
    if (input == '0') {
        state = 'none'
    } else {
        state = 'block'
    }
    document.getElementById('effects').style.display = state
    document.getElementById('colorpicker').style.display = state

    ipcRenderer.send('resize', [995, state == 'block' ? 710 : 500])
}

const disableSpeed = async(id) => {
    let speedid
    if (id > 4 || id == 0)
        speedid = id;

    if (speedid == undefined) {
        await fetchData(`${loc_aurora}/config`, false).then(async(value) => {
            speedid = value.mode
        })
    }

    let speed = document.getElementById("speed").style
    if (speedid === '7' || speedid === '10' || speedid === '0')
        speed.display = "none"
    else
        speed.display = "block"
}

async function shelldir() {
    return await ipcaction("shelldir")
}



module.exports = { options, ipcaction, loc_aurora, accentColor, getchangelog, saveDef, fetchData, setkeyboardsettings, disableSpeed, shelldir }