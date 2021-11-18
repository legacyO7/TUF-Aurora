#!/bin/bash

signingfileloc="/lib/modules/$(uname -r)/build/certs"
faustusDir="/sys/devices/platform/faustus/"
packages_to_install="dkms openssl mokutil xterm"
filename_key="signing_key"
pkgExt="unknown"
pm="unknown"
require_reboot=false


declare -A osInfo;
osInfo[/etc/redhat-release]="rmp"
osInfo[/etc/debian_version]="deb"

for f in ${!osInfo[@]}
do
    if [[ -f $f ]];then
        pkgExt="${osInfo[$f]}"
    fi
done


install_packages ()
{
    echo "Installing packages"

            if [ $pkgExt == "rpm" ] 
            then
                pm="yum"
            elif [ $pkgExt == "deb" ] 
                then
                pm="apt-get"
            fi

        sudo $pm install $packages_to_install -y
    
}


install_faustus()
{
    echo "Installing faustus"

        if [ -d "$faustusDir" ]; then
            echo faustus module found
            else
            echo installing faustus module

                git clone --depth=1 https://github.com/legacyO7/faustus.git

                cd faustus

                    if mokutil --sb-state | grep -q 'enabled'; then

                        require_reboot=true              
                        
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

                            openssl req -new -nodes -utf8 -sha512 -days 36500 -batch -x509 -config x509.genkey -outform DER -out ${filename_key}.x509 -keyout ${filename_key}.pem -subj "/CN=Aurora/"
                                                    
                    fi    

                sudo echo "blacklist asus_wmi
                    blacklist asus_nb_wmi" > /etc/modprobe.d/faustus.conf

                sudo rmmod asus_nb_wmi
                sudo rmmod asus_wmi

                make
                sudo modprobe sparse-keymap wmi video

                if [ "$require_reboot" = true ] 
                then
                    sudo /usr/src/linux-headers-`uname -r`/scripts/sign-file sha256 ./${filename_key}.pem ./${filename_key}.x509 src/faustus.ko
                    echo "=== MOK ENROLLMENT PASSWORD ==="
                    sudo mokutil --import ${filename_key}.x509  
                    sudo mv ${filename_key}.pem $signingfileloc
                fi

                sudo insmod src/faustus.ko

                sudo make dkms
                sudo modprobe faustus

                sudo make onboot
                sudo ./set_rgb.sh

                make clean

            cd ..
            rm -rf faustus
        fi

}

if [ $# -eq 0 ]
  then
    ./setup.sh
else
    if [ $pkgExt == "unknown" ] 
        then
            echo Sorry dude, Incompatible Operating System
            else

            if [ $# -eq 0 ]
            then
                echo "No arguments supplied"

                elif [ $1 == "pi" ]
                then
                install_packages

                elif [ $1 == "fi" ]
                then
                install_faustus                
            fi
    fi

fi