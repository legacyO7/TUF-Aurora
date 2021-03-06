
# TUF-Aurora v2

This is a fork of the discontinued project [TUF-Control](https://github.com/icodelifee/TUF-Control.git) focused on Battery Management and Keyboard Lighting <a href="https://github.com/hackbnw/faustus">hackbnw/faustus</a> Driver Module For ASUS TUF Gaming Series Laptops

<img src="https://github.com/legacyO7/TUF-Aurora/raw/master/src/images/ss.png"/> 

# Notes
* This application will only work on devices which supports faustus module
* Devices with secureboot enabled might have to enroll mok on reboot

<br/>

## Download Release
<a href="https://github.com/legacyO7/TUF-Aurora/releases">Package Releases</a>


## Build and install
<ol>
  <li><code>git clone https://github.com/legacyO7/TUF-Aurora.git</code></li>
  <li><code>cd TUF-Aurora/</code></li>
  <li><code>./setup.sh</code></li>
</ol>

## Uninstall 
<ol>
  <li><code>./setup_minimal.sh uninstall 3</code></li>
  where,  3 - complete uninstallation <br/>
          2 - disables faustus module and uninstalls the app <br/>
          1 - removes battery manager and uninstalls the app <br/>
</ol>

## Having issues with v2 installation? try legacy
<ol>
  <li><code>git clone https://github.com/legacyO7/TUF-Aurora.git -b legacy</code></li>
  <li><code>cd TUF-Aurora/</code></li>
  <li><code>./setup.sh</code></li>
</ol>

## How to install faustus module
<a href="https://github.com/hackbnw/faustus">hackbnw/faustus</a>
