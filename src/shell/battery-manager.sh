#!/bin/bash
echo $1 > /sys/class/power_supply/BAT1/charge_control_end_threshold
