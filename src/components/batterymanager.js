const getdefvalue = require('../utils/getdefaults');
const paths = require('../path');
var sudo = require('sudo-prompt');

var options = {
    name: 'TUFController',
};

var rangeslider = document.getElementById("batterymanager-input");

const batterymanager = async() => {

    var output = document.getElementById("charge");
    var sliderVal = document.getElementById("batterymanager-input");
    getdefvalue(paths.batterymanager).then((value) => {
        output.innerText = value
        sliderVal.value = value.replace(/\s+/g, '')
        sliderVal.style.background = `hsl(${parseInt(sliderVal.value)+20}, 100%, 75%,0.8)`
    })


    rangeslider.oninput = function() {
        output.innerHTML = this.value
        sliderVal.style.background = `hsl(${parseInt(sliderVal.value)+20}, 100%, 75%,0.8)`

    }

    //  rangeslider.style.backgroundColor = require('./picker').colorcode


    $('#applylimit').on('click', () => {
        sudo.exec('bash ' + __dirname + `/../shell/battery-manager.sh ${rangeslider.value}`, options,
            function(error, stdout, stderr) {
                if (error) throw error;
            }
        );
    });

};

module.exports = batterymanager;