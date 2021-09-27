const permsHandler = require('./utils/permshandler');
const { initialize, setkeyboardsettings } = require('./utils/init');
const { setPicker } = require('./components/picker');
const batterymanager = require('./components/batterymanager');
const { updatechecker } = require('./components/versionchecker');
const { keyboardSettings } = require('./components/keyboardSettings');

permsHandler();
await initialize();
updatechecker();
setPicker();
batterymanager();
keyboardSettings()