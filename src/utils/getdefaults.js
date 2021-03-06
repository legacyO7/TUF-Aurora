const { ashell } = require("./shell");

const getdefvalue = async(path) => {
    return await new Promise((resolve, reject) => {

        ashell(`cat ${path}`).then(output => {
            resolve(output.replace(/\s+/g, ''))
        });
    });
}

module.exports = getdefvalue;