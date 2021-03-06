const { saveDef, setkeyboardsettings, disableSpeed, shelldir } = require('../global');
const paths = require('../path');
const { ashell } = require('../utils/shell');

function keyboardSettings() {

    $('input:radio').on('click', function(e) {
        if (e.target.name === 'brightness') {
            writeKeyboardConfig(e.target.name, (e.currentTarget.id).split('_')[1], 0)
        } else if (e.target.name === 'speed') {
            writeKeyboardConfig(e.target.name, (e.currentTarget.id).split('_')[1], 4)
        } else if (e.target.name === 'mode') {
            writeKeyboardConfig(e.target.name, (e.currentTarget.id).split('_')[1], 7)
        }
    });

}

async function writeKeyboardConfig(name, id, offset) {
    for (i = 0; i < 11; i++)
        if (!document.getElementById(`k_${i}`).checked)
            document.getElementById(`l_${i}`).classList.remove("card")

    document.getElementById(`l_${id}`).classList.add("card")

    if (offset == 0) {
        ashell(`echo "${id}" > ${paths.brightness}`);
        setkeyboardsettings(id)
    } else {
        ashell('bash ' + await shelldir() + '/' + name + '.sh ' + (parseInt(id) - offset));
    }
    await saveDef(name, id)
    disableSpeed(id)

}

module.exports = { keyboardSettings }