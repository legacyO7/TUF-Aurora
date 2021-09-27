const shell = require('shelljs');
const { saveDef, setkeyboardsettings } = require('../global');
const paths = require('../path');
var fs = ('fs');


function keyboardSettings() {
    $('input:radio').on('click', function(e) {

        if (e.target.name === 'brightness') {
            writeKeyboardConfig(e.target.name, (e.currentTarget.id).split('_')[1])
        } else if (e.target.name === 'speed') {
            // check if clicked button is of keyboard speed		
            $('#btn-speed').prop('disabled', false);
            writeKeyboardConfig(e.target.name, (e.currentTarget.id).split('_')[1], 4)

        } else if (e.target.name === 'mode') {

            if (e.currentTarget.id === '8' || e.currentTarget.id === '9')
                $('#btn-speed').prop('disabled', false);
            else
                $('#btn-speed').prop('disabled', true);
            writeKeyboardConfig(e.target.name, (e.currentTarget.id).split('_')[1], 7)
        }
    });

}

function writeKeyboardConfig(name, id, offset) {
    if (offset == undefined) {
        shell.exec(`echo "${id}" > ${paths.brightness}`);
        setkeyboardsettings(id)
    } else
        shell.exec('bash ' + __dirname + '/../shell/' + name + '.sh ' + (parseInt(id) - offset));
    saveDef(name, id)
}

module.exports = { keyboardSettings }