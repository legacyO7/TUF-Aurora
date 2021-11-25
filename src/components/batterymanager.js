const getdefvalue = require('../utils/getdefaults');
const paths = require('../path');
const { sudoshell } = require('../utils/shell');

const batterymanager = async() => {

    var output = document.getElementById("charge");
    var rangeslider = document.getElementById("batterymanager-input");
    getdefvalue(paths.batterymanager).then((value) => {
        output.innerText = value
        rangeslider.value = value.replace(/\s+/g, '')
        rangeslider.style.setProperty('--SliderColor', `hsl(${(120-rangeslider.value)}, 100%, 50%)`)
        rangeslider.style.setProperty('--SliderHeight', `-.${rangeslider.value-1}em`)
        rangeslider.style.setProperty('--SliderSpread', `${rangeslider.value-43}px`)
    })


    rangeslider.onchange = function() {
        sudoshell(('bash ' + __dirname + `/../shell/battery-manager.sh ${rangeslider.value}`))
    }


    rangeslider.oninput = function() {
        output.innerHTML = this.value
        rangeslider.style.setProperty('--SliderColor', `hsl(${(120-rangeslider.value)}, 100%, 50%)`)
        rangeslider.style.setProperty('--SliderHeight', `-.${rangeslider.value-1}em`)
        rangeslider.style.setProperty('--SliderSpread', `${rangeslider.value-43}px`)
    }
};

module.exports = batterymanager;