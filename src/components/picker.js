const pickr = require('@simonwep/pickr');
const paths = require('../path');
const shell = require('shelljs');
shell.config.execPath = shell.which('node').toString();
const getdefvalue = require('../utils/getdefaults')

var debug = document.getElementById("debugger");
var colorcode = "#123456"

const setPicker = async() => {
    colorcode = ('#' + await getdefvalue(paths.path_red) + await getdefvalue(paths.path_green) + await getdefvalue(paths.path_blue))
        //  changebackgroudColor(colorcode)
    const picker = pickr.create({
        el: '.color-picker',
        theme: 'nano',
        padding: 8,
        default: colorcode,
        swatches: [
            '#ED1000',
            '#FF0057',
            '#2BFF01',
            '#FF00E5',
            '#005CFF',
        ],
        components: {
            hue: true,
            preview: true,
            interaction: {
                hex: true,
                input: true,
                clear: true,
                save: true,
            },
        },
    })

    picker.on('save', (color, instance) => {

        try {
            const splitHex = `${color.toHEXA()[0]} ${color.toHEXA()[1]} ${color.toHEXA()[2]}`;
            //changebackgroudColor(color)
            shell.exec('bash ' + __dirname + `/../shell/color.sh ${splitHex}`);

        } catch (e) {
            console.log('Error:', e.stack);
        }
    });

}

module.exports = setPicker;