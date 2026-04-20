#!/bin/bash

options=" Power Off\n Reboot\n Suspend\n Logout"

# We added the -theme flag here
chosen="$(echo -e "$options" | rofi -dmenu -i -p "Power" -theme ~/.config/rofi/powermenu.rasi)"

case "$chosen" in
    *Power*) systemctl poweroff ;;
    *Reboot*) systemctl reboot ;;
    *Suspend*) systemctl suspend ;;
    *Logout*) i3-msg exit ;;
esac
