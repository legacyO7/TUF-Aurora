const ReinventedColorWheel = require("reinvented-color-wheel");
const { saveDef, loc_aurora, fetchData, shelldir } = require('../global');
const { ashell } = require('../utils/shell');

const setPicker = async() => {

    const colorPicker = new ReinventedColorWheel({
        hex: (await fetchData(`${loc_aurora}/config`, false)).color,
        appendTo: document.getElementById('picker'),
        wheelDiameter: 200,
        wheelThickness: 20,
        handleDiameter: 16,
        wheelReflectsSaturation: true,
        onChange: function(color) {
            saveColor(color)
        },

    });

    const saveColor = async(color) => {
        try {
            const splitHex = `${color.hex.substr(1,2)} ${color.hex.substr(3,2)} ${color.hex.substr(5,2)}`;
            ashell('bash ' + await shelldir() + `/color.sh ${splitHex}`);
            saveDef("color", color.hex)

        } catch (e) {
            console.log('Error:', e.stack);
        }
    }

}

module.exports = { setPicker };