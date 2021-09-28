#!/bin/bash

signingfileloc="/lib/modules/$(uname -r)/build/certs"
faustusDir="/sys/devices/platform/faustus/"

sudo apt install dkms openssl nodejs npm mokutil xterm-y

if [ -d "$faustusDir" ]; then
   echo faustus module found
else
   echo installing faustus module

    git clone https://github.com/legacyO7/faustus.git

    cd faustus

    if [ -f "$signingfileloc/signing_key.pem" ]; then
        echo found sigining key
    else

        echo "[ req ]
        default_bits = 4096
        distinguished_name = req_distinguished_name
        prompt = no
        x509_extensions = myexts

        [ req_distinguished_name ]
        CN = Modules

        [ myexts ]
        basicConstraints=critical,CA:FALSE
        keyUsage=digitalSignature
        subjectKeyIdentifier=hash
        authorityKeyIdentifier=keyid" >  x509.genkey

        openssl req -new -nodes -utf8 -sha512 -days 36500 -batch -x509 -config x509.genkey -outform DER -out signing_key.x509 -keyout signing_key.pem
        sudo mv signing_key.pem $signingfileloc

    fi

    sudo echo "blacklist asus_wmi
        blacklist asus_nb_wmi" > /etc/modprobe.d/faustus.conf

    sudo rmmod asus_nb_wmi
    sudo rmmod asus_wmi

    make
    sudo modprobe sparse-keymap wmi video
    sudo insmod src/faustus.ko

    sudo make dkms
    sudo modprobe faustus

    sudo make onboot
    sudo ./set_rgb.sh

    make clean

   cd ..
fi

npm install
sudo npm install electron-packager electron-installer-debian -g
npm run clean-build
npm run-script build
npm run-script deb64
sudo dpkg -i dist/installers/tuf-aurora_*.deb

if [ -d "$faustusDir" ]; then
   echo Success
   nohup tuf-aurora &  disown 
   echo launched aurora
   ps aux | grep sleep
   exit 
else
    echo Naah bruh. Things didnt go as planned. Install faustus module manually
fi

