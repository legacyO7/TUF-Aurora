
# TUF-Aurora

This is a fork of the discontinued project [TUF-Control](https://github.com/icodelifee/TUF-Control.git) focused on Battery Manager and Keyboard Lighting <a href="https://github.com/hackbnw/faustus">hackbnw/faustus</a> Driver Module For ASUS TUF Gaming Series Laptops

<img src="https://github.com/legacyO7/TUF-Aurora/raw/master/images/ss.png"/> 

## Automated installation
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
  <li><code>sudo npm install electron-packager electron-installer-debian -g</code></li>
  <li><code>npm run clean-build</code></li>
  <li><code>npm run-script build</code></li>
  <li><code>npm run-script deb64</code></li>
  <li><code>sudo dpkg -i dist/installers/tuf-aurora_*.deb</code></li>
</ol>