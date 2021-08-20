const fs = require('fs');
const paths = require('../path');
const sudoPrompt = require('./sudoprompt');

// check for read or write perms in module directory and 
// request for sudo perms if it doesnt have perms

const initialize = () => {
	if(!fs.existsSync(`${paths.kModule}`)){
        document.getElementById('content').style.display = 'block'
        document.getElementById('blockuser').style.display = 'none'
    }
    else
    {
        document.getElementById('content').style.display = 'none'
        document.getElementById('blockuser').style.display = 'block'
    }
    
    
    
    document.getElementById(parseInt(shell.exec(`cat ${paths.brightness}`)),10).checked=true
    document.getElementById(4+parseInt(shell.exec(`cat ${paths.speed}`)),10).checked=true
    document.getElementById(7+parseInt(shell.exec(`cat ${paths.kblMode}`)),10).checked=true
    
};

module.exports = initialize;
