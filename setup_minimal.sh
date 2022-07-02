#!/bin/bash

signingfileloc="/lib/modules/$(uname -r)/build/certs"
faustusDir="/sys/devices/platform/faustus/"
packages_to_install="dkms openssl mokutil xterm wget git"
filename_key="signing_key"
pkgExt="unknown"
pm="unknown"
opm="unknown"
tmpdir="/tmp"
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


if [ $pkgExt == "rpm" ] 
    then
    pm="yum"
    opm="rpm"
elif [ $pkgExt == "deb" ] 
    then
    pm="apt-get"
    opm="dpkg"
fi


install_packages ()
{
    echo "Installing packages"

        sudo $pm install $packages_to_install -y
    
}


install_faustus()
{
    echo "Installing faustus"

        if [ -d "$faustusDir" ]; then
            echo faustus module found
            else
            echo installing faustus module

            mkdir -p $tmpdir

                git clone --depth=1 https://github.com/legacyO7/faustus.git $tmpdir/faustus

                cd $tmpdir/faustus

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

                printf "blacklist asus_wmi \nblacklist asus_nb_wmi" | sudo tee /etc/modprobe.d/faustus.conf

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

download_release(){
    echo downloading update...

    LATEST_RELEASE=$(curl -L -s -H 'Accept: application/json' https://github.com/legacyO7/TUF-Aurora/releases/latest)
    LATEST_VERSION=$(echo $LATEST_RELEASE | sed -e 's/.*"tag_name":"\([^"]*\)".*/\1/')

        if [ $pkgExt == "deb" ] 
            then
                ARTIFACT_URL="https://github.com/legacyO7/TUF-Aurora/releases/download/$LATEST_VERSION/tuf-aurora_${LATEST_VERSION}_amd64.$pkgExt"
        elif [ $pkgExt == "rpm" ] 
            then
                ARTIFACT_URL="https://github.com/legacyO7/TUF-Aurora/releases/download/$LATEST_VERSION/tuf-aurora-${LATEST_VERSION}.x86_64.$pkgExt"
        fi

    wget $ARTIFACT_URL -O /tmp/update.$pkgExt

    sudo $opm -i /tmp/update.$pkgExt 
    
}


remove_battery_man(){
    #uninstall battery manager
    echo -e "\033[1;34m Removing battery manager\033[0m"
    sudo systemctl disable tuf-controller.service
    sudo rm  /etc/systemd/system/tuf-controller.service
}


disable_faustus(){
    #disable faustus
    echo -e "\033[1;34m Halting faustus\033[0m"
    sudo modprobe -r faustus
    printf "blacklist faustus\n" | sudo tee /etc/modprobe.d/faustus.conf
    sudo modprobe asus_nb_wmi
    sudo modprobe asus_wmi
}

uninstall_app(){   
    
    #uninstall aurora
    echo -e "\033[1;34m Uninstalling aurora\033[0m"
    rm -f ~/.tuf-aurora
    sudo $pm remove tuf-aurora -y
    echo -e "\033[0;31mbye.. bye.."

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

                elif [ $1 == "update" ]
                then
                download_release        

                elif [ $1 == "uninstall" ]
                then

                        if [ $2 == "1" ]
                        then
                        remove_battery_man  
                        elif [ $2 == "2" ]
                        then
                        disable_faustus
                        elif [ $2 == "3" ]    
                        then 
                        remove_battery_man
                        disable_faustus
                        fi  
                uninstall_app  
                        
            fi
    fi

fi