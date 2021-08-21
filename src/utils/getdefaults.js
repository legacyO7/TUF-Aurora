const shell = require('shelljs');
shell.config.execPath = shell.which('node').toString();

const getdefvalue=async(path)=>{	
    
 return await new Promise((resolve, reject) => {	
   shell.exec(`cat ${path}`, function(
        error,
        stdout,
		stderr	
    ) {	
	 resolve(stdout)	 
    });
});
}

module.exports=getdefvalue;