const { ipcRenderer } = require('electron');
const shell = require('shelljs');
const { existsSync } = require('fs');
const untildify = require('untildify');

var options = {
    name: 'Aurora',
};

var branch = "beta"

var loc_aurora = untildify("~/.tuf-aurora");

const ipcaction = async(name, options) => {
    ipcRenderer.send(name, options);
    return await new Promise((resolve, reject) => {
        ipcRenderer.on(name + "-response", function(event, args) {
            resolve(args)
        });
    });
}

async function fetchData(url, changelog) {
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
    if (existsSync(`${loc_aurora}/settings`)) {
        defaults = await fetchData(`${loc_aurora}/settings`, false)
    } else
        defaults = { color: "#000000", k_effects: "0", k_speed: "0", k_brightness: "0" }

    defaults[key] = value;
    shell.exec("echo " + JSON.stringify(JSON.stringify(defaults)) + " > " + loc_aurora + "/settings")
}


module.exports = { options, ipcaction, branch, loc_aurora, getchangelog, saveDef, fetchData }