const shell = require('shelljs');
const paths = require('./path');
const permsHandler = require('./utils/permshandler');
const { initialize, setkeyboardsettings } = require('./utils/init');
const { setPicker } = require('./components/picker');
const batterymanager = require('./components/batterymanager');
var fs = ('fs');

permsHandler();
initialize();
setPicker();
batterymanager();

$('input:radio').on('click', function(e) {

    if (e.target.name === 'brightness') {
        // check if the button is of keyboard brightness
        shell.exec(`echo "${e.currentTarget.id}" > ${paths.brightness}`);

        setkeyboardsettings(e.currentTarget.id)

    } else if (e.target.name === 'speed') {
        // check if clicked button is of keyboard speed		
        $('#btn-speed').prop('disabled', false);
        shell.exec('bash ' + __dirname + '/shell/speed.sh ' + (e.currentTarget.id - 4));
    } else if (e.target.name === 'mode') {
        if (e.currentTarget.id === '8' || e.currentTarget.id === '9')
            $('#btn-speed').prop('disabled', false);
        else
            $('#btn-speed').prop('disabled', true);
        shell.exec('bash ' + __dirname + '/shell/mode.sh ' + (e.currentTarget.id - 7));
    }

});