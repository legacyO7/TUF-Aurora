const { ashell } = require('./shell');
const { shelldir } = require('../global');
const { ipcRenderer } = require('electron');


$('#btnclose').on('click', () => {
    document.getElementById("uninstall-modal").style.display = "none";

})

$('#uninstall').on('click', () => {
    document.getElementById("uninstall-modal").style.display = "block";

})


$('#finalized_uninstall').on('click', async() => {
        var count = 0;

        if (document.getElementById("bm").checked)
            count++;
        if (document.getElementById("fm").checked)
            count += 2;

        await uninstall(count);
        document.getElementById("uninstall-modal").style.display = "none";
        ipcRenderer.send('halt')
    }

)

async function uninstall(value) {
    await ashell(`xterm -e "${await shelldir()}/../../setup_minimal.sh uninstall ${value}"`);
}

module.exports = { uninstall };