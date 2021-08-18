#!/bin/bash

signingfileloc="/lib/modules/$(uname -r)/build/certs"

sudo apt install dkms openssl install nodejs npm -y

git clone https://github.com/hackbnw/faustus.git

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

echo "blacklist asus_wmi
      blacklist asus_nb_wmi" > /etc/modprobe.d/faustus.conf

sudo rmmod asus_nb_wmi
sudo rmmod asus_wmi
sudo rmmod faustus

make
sudo modprobe sparse-keymap
sudo modprobe wmi
sudo modprobe video
sudo insmod ./src/faustus.ko let_it_burn=1

make dkms
sudo modprobe faustus

sudo make onboot
sudo ./set_rgb.sh

sudo mv ./src/faustus.ko /usr/bin/
make clean

cd ..

npm install
sudo npm install electron-packager -g
npm run-script build
sudo npm install -g electron-installer-debian
electron-installer-debian --src dist/tufcontrol-electron-linux-x64/ --dest dist/installers/ --arch amd64
sudo dpkg -i dist/installers/tufcontrol-electron_1.0.0_amd64.deb
tufcontrol-electron
