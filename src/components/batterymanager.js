const getdefvalue = require('../utils/getdefaults');
const paths = require('../path');
var sudo = require('sudo-prompt');
const { options } = require('../global');

var rangeslider = document.getElementById("batterymanager-input");

const batterymanager = async() => {

    var output = document.getElementById("charge");
    var sliderVal = document.getElementById("batterymanager-input");
    getdefvalue(paths.batterymanager).then((value) => {
        output.innerText = value
        sliderVal.value = value.replace(/\s+/g, '')
        rangeslider.style.setProperty('--SliderColor', `hsl(${sliderVal.value-(100-sliderVal.value)}, 100%, 50%)`)
        rangeslider.style.setProperty('--SliderHeight', `-.${sliderVal.value-1}em`)
        rangeslider.style.setProperty('--SliderSpread', `${sliderVal.value-53}px`)
    })


    rangeslider.oninput = function() {
        output.innerHTML = this.value
        rangeslider.style.setProperty('--SliderColor', `hsl(${sliderVal.value-(100-sliderVal.value)}, 100%, 50%)`)
        rangeslider.style.setProperty('--SliderHeight', `-.${sliderVal.value-1}em`)
        rangeslider.style.setProperty('--SliderSpread', `${sliderVal.value-53}px`)
    }


    $('#applylimit').on('click', () => {
        sudo.exec('bash ' + __dirname + `/../shell/battery-manager.sh ${rangeslider.value}`, options,
            function(error, stdout, stderr) {
                if (error) throw error;
            }
        );
    });

};

module.exports = batterymanager;