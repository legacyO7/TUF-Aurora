const paths = require('../path');
const shell = require('shelljs');
shell.config.execPath = shell.which('node').toString();
const getdefvalue = require('../utils/getdefaults')
const ReinventedColorWheel = require("reinvented-color-wheel");

var colorcode = "#123456"

const setPicker = async() => {
    colorcode = ('#' + await getdefvalue(paths.path_red) + await getdefvalue(paths.path_green) + await getdefvalue(paths.path_blue))

    const colorPicker = new ReinventedColorWheel({
        hex: colorcode,
        appendTo: document.getElementById('picker'),
        wheelDiameter: 200,
        wheelThickness: 20,
        handleDiameter: 16,
        wheelReflectsSaturation: true,
        onChange: function(color) {
            saveColor(color)
        },

    });

    const saveColor = (color) => {
        try {
            const splitHex = `${color.hex.substr(1,2)} ${color.hex.substr(3,2)} ${color.hex.substr(5,2)}`;
            colorcode = color.hex
            shell.exec('bash ' + __dirname + `/../shell/color.sh ${splitHex}`);

        } catch (e) {
            console.log('Error:', e.stack);
        }
    }

}

module.exports = { setPicker, colorcode };