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
    })



    rangeslider.oninput = function() {
        output.innerHTML = this.value
    }

    $('#applylimit').click(() => {

        sudo.exec('bash ' + __dirname + `/../shell/battery-manager.sh ${rangeslider.value}`, options,
            function(error, stdout, stderr) {
                document.getElementById("debugger").innerText = "error"
                if (error) throw error;
                console.log('stdout: ' + stdout);
            }
        );
    });

};

module.exports = batterymanager;