#!/bin/bash

echo $1 | sudo tee /sys/class/power_supply/BAT1/charge_control_end_threshold > /dev/null
cd /etc/systemd/system/
sudo rm tuf-controller.service
sudo systemctl disable tuf-controller.service
echo "[Unit]
Description=To set battery charge threshold
After=multi-user.target
StartLimitBurst=0

[Service]
Type=oneshot
Restart=on-failure
ExecStart=sudo /bin/bash -c 'echo $1 > /sys/class/power_supply/BAT1/charge_control_end_threshold'

[Install]
WantedBy=multi-user.target" > tuf-controller.service

sudo systemctl enable tuf-controller.service
