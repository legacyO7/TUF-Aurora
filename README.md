
# TUF-Aurora

This is a fork of the discontinued project [TUF-Control](https://github.com/icodelifee/TUF-Control.git) focused on Battery Management and Keyboard Lighting <a href="https://github.com/hackbnw/faustus">hackbnw/faustus</a> Driver Module For ASUS TUF Gaming Series Laptops

<img src="https://github.com/legacyO7/TUF-Aurora/raw/master/src/images/ss.png"/> 

# Notes
* This application will only work on devices which supports faustus module
* Devices with secureboot enabled might have to enroll mok on reboot

<br/>

## Automated installation [ Recommended ]
<ol>
  <li><code>git clone https://github.com/legacyO7/TUF-Aurora.git</code></li>
  <li><code>cd TUF-Aurora/</code></li>
  <li><code>./setup.sh</code></li>
</ol>


## How to compile .deb package
<ol>
  <li><code>sudo apt-get install nodejs npm</code></li>
  <li><code>git clone https://github.com/legacyO7/TUF-Aurora.git</code></li>
  <li><code>cd TUF-Aurora/</code></li>
  <li><code>npm install</code></li>
  <li><code>npm run clean-build</code></li>
  <li><code>npm run dist</code></li>
  <li><code>sudo dpkg -i dist/tuf-aurora_*.deb</code></li>
</ol>

## How to compile .rpm package
<ol>
  <li><code>sudo yum install nodejs npm</code></li>
  <li><code>git clone https://github.com/legacyO7/TUF-Aurora.git</code></li>
  <li><code>cd TUF-Aurora/</code></li>
  <li><code>npm install</code></li>
  <li><code>npm run clean-build</code></li>
  <li><code>npm run dist</code></li>
  <li><code>sudo rpm -i dist/tuf-aurora_*.rpm</code></li>
</ol>

## How to install faustus module
<a href="https://github.com/hackbnw/faustus">hackbnw/faustus</a>
