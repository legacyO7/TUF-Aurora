const shell = require('shelljs');
const paths = require('./path');
const permsHandler = require('./utils/permshandler');
const init = require('./utils/init');
const pickr = require('./components/picker');
var fs = require('fs');
shell.config.execPath = shell.which('node').toString();

var debug = document.getElementById("debugger");

// TODO
// Handle two type of fan
$(document).ready(function (e) {
	$('#btn-speed').prop('disabled', true);
});

permsHandler();
init();


var rangeslider = document.getElementById("batterymanager-input");
var output = document.getElementById("charge");
output.innerHTML = shell.exec(`cat ${paths.batterymanager}`);

var sudo = require('sudo-prompt');
var options = {
  name: 'TUFController',
};

$('input:radio').on('click', function (e) {

	if (e.target.name === 'brightness'){
		// check if the button is of keyboard brightness
		shell.exec(`echo "${e.currentTarget.id}" > ${paths.brightness}`);
		changeFanMode('#silent', '#a4508b', 'linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)', '2');
	}

	else if (e.target.name === 'speed' ){
		// check if clicked button is of keyboard speed		
		$('#btn-speed').prop('disabled', false);
		shell.exec('bash ' + __dirname + '/shell/speed.sh ' + (e.currentTarget.id-4));
	}

	else if (e.target.name === 'mode') {
		if (e.currentTarget.id === '8' || e.currentTarget.id === '9') 
		$('#btn-speed').prop('disabled', false);
		else 
		$('#btn-speed').prop('disabled', true);
		shell.exec('bash ' + __dirname + '/shell/mode.sh ' + (e.currentTarget.id-7));
	} 
	 
});

$('#normal').click(() => {
	disableOther();
	changeFanMode('#normal', '#11998e', 'linear-gradient(to right, #11998e, #38ef7d)', '0');
});

$('#boost').click(() => {
	disableOther();
	changeFanMode('#boost', 'white', 'linear-gradient(45deg, #a73737, #7a2828)', '1');
});

$('#silent').click(() => {
	disableOther();
	changeFanMode('#silent', '#a4508b', 'linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)', '2');
});

const disableOther = () => {
	$('#normal,#boost,#silent').css('background-color', 'white');
	$('#normal-title,#boost-title,#silent-title').css('color', 'black');
};


rangeslider.oninput = function() {
  output.innerHTML = this.value
 
}

$('#applylimit').click(() => {
	sudo.exec('bash ' + __dirname + `/shell/battery-manager.sh ${rangeslider.value}`, options,
  function(error, stdout, stderr) {
    if (error) throw error;
    console.log('stdout: ' + stdout);
  }
);
});