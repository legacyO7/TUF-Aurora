const shell = require('async-shelljs');
const { saveDef, setkeyboardsettings, disableSpeed } = require('../global');
const paths = require('../path');
var fs = ('fs');


function keyboardSettings() {
    $('input:radio').on('click', function(e) {

        if (e.target.name === 'brightness') {
            writeKeyboardConfig(e.target.name, (e.currentTarget.id).split('_')[1])
        } else if (e.target.name === 'speed') {
            writeKeyboardConfig(e.target.name, (e.currentTarget.id).split('_')[1], 4)
        } else if (e.target.name === 'mode') {
            writeKeyboardConfig(e.target.name, (e.currentTarget.id).split('_')[1], 7)
        }
    });

}

function writeKeyboardConfig(name, id, offset) {
    disableSpeed(id)
    if (offset == undefined) {
        shell.exec(`echo "${id}" > ${paths.brightness}`);
        setkeyboardsettings(id)
    } else
        shell.exec('bash ' + __dirname + '/../shell/' + name + '.sh ' + (parseInt(id) - offset));
    saveDef(name, id)
}

module.exports = { keyboardSettings }