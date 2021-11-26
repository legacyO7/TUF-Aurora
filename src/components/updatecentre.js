const { ipcaction, fetchData, shelldir } = require('../global')
const execShell = require('../pages/setup');

async function updateCentre() {

    var currentversion, latestversion;

    let closebutton = document.getElementById("btn-close")
    let updatebutton = document.getElementById("btn-update")

    await ipcaction('appversion').then((args) => {
        currentversion = args[0];
    });

    var uptext = document.getElementById("uptext");
    uptext.innerText = "v" + currentversion;

    if (window.navigator.onLine) {

        let dir = await shelldir()

        if (!dir.includes("/tmp/") && !dir.includes("/snap/")) {
            var modal = document.getElementById("update-modal");
            let upbar = document.getElementById('upbar')

            latestversion = (await fetchData("https://raw.githubusercontent.com/legacyO7/TUF-Aurora/master/package.json", true)).version;

            if (currentversion != latestversion) {
                modal.style.display = "block";
                document.getElementById('update-text').innerText = `v${latestversion}`;
            }

            closebutton.onclick = function() {
                modal.style.display = "none";
            };
            updatebutton.onclick = async function() {
                document.getElementById('appheader').style.marginLeft = "70px";
                upbar.style.visibility = "visible";
                uptext.innerText = "Updating";
                closebutton.style.display = "none"
                updatebutton.style.display = "none"

                await execShell("update").then(resp => {
                    upbar.style.visibility = "hidden"
                    uptext.innerText = "v" + currentversion;
                });
            };

        }





    }

}

module.exports = { updateCentre }