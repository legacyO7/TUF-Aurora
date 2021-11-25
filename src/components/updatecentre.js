const { branch, ipcaction, fetchData } = require('../global')
const execShell = require('../pages/setup');

async function updateCentre() {

    var currentversion, latestversion;

    let currentbranch = await branch()

    let closebutton = document.getElementById("btn-close")
    let updatebutton = document.getElementById("btn-update")

    await ipcaction('appversion').then((args) => {
        currentversion = args[0];
    });

    var uptext = document.getElementById("uptext");
    uptext.innerText = "v" + currentversion;
    if (currentbranch == "beta")
        uptext.innerText += '' + currentbranch

    if (window.navigator.onLine) {

        var modal = document.getElementById("update-modal");

        latestversion = (await fetchData("https://raw.githubusercontent.com/legacyO7/TUF-Aurora/" + currentbranch + "/package.json", true)).version;

        if (currentversion != latestversion) {
            modal.style.display = "block";
            document.getElementById('update-text').innerText = `v${latestversion}`;
        }

        closebutton.onclick = function() {
            modal.style.display = "none";
        };
        updatebutton.onclick = function() {
            document.getElementById('appheader').style.marginLeft = "70px";
            document.getElementById('upbar').style.visibility = "visible";
            uptext.innerText = "Updating";
            closebutton.style.display = "none"
            updatebutton.style.display = "none"

            execShell("update");
        };



    }

}

module.exports = { updateCentre }