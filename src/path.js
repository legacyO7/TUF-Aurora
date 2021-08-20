module.exports = {
    kModule: '/sys/devices/platform/faustus/',
	fanModeBoost: '/sys/devices/platform/faustus/fan_boost_mode',
	fanModeTTP: '/sys/devices/platform/faustus/throttle_thermal_policy',
	brightness: '/sys/devices/platform/faustus/leds/asus::kbd_backlight/brightness',
    rgb: '/sys/devices/platform/faustus/kbbl/*',
    kblMode: '/sys/devices/platform/faustus/kbbl/kbbl_mode',
    batterymanager:'/sys/class/power_supply/BAT1/charge_control_end_threshold',
    path_red:'/sys/devices/platform/faustus/kbbl/kbbl_red',
    path_green:'/sys/devices/platform/faustus/kbbl/kbbl_green',
    path_blue:'/sys/devices/platform/faustus/kbbl/kbbl_blue',
    speed:'/sys/devices/platform/faustus/kbbl/kbbl_speed'
};
