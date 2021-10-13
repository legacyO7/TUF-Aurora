const { permsHandler } = require('./utils/permshandler');
const { initialize } = require('./utils/init');
const { setPicker } = require('./components/picker');
const batterymanager = require('./components/batterymanager');
const { updateCentre } = require('./components/updatecentre');
const { keyboardSettings } = require('./components/keyboardSettings');

await permsHandler();
await initialize();
updateCentre();
setPicker();
batterymanager();
keyboardSettings()