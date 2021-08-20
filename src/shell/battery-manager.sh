#!/bin/bash

echo $1 | sudo tee /sys/class/power_supply/BAT1/charge_control_end_threshold > /dev/null
cd /etc/systemd/system/
sudo rm tuf-controller.service
sudo systemctl disable tuf-controller.service
if [ -d "/sys/devices/platform/faustus/" ]; then
   execCommand='insmod /usr/bin/faustus.ko let_it_burn=1 && echo $1 > /sys/class/power_supply/BAT1/charge_control_end_threshold'
else
    execCommand='echo $1 > /sys/class/power_supply/BAT1/charge_control_end_threshold'
fi
echo "[Unit]
Description=To set battery charge threshold
After=multi-user.target
StartLimitBurst=0

[Service]
Type=oneshot
Restart=on-failure
ExecStart=sudo /bin/bash -c '$execCommand'

[Install]
WantedBy=multi-user.target" > tuf-controller.service

sudo systemctl enable tuf-controller.service
