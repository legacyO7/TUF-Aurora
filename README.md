# TUF-Control
A Keyboard Lighting, Battery Manager And Fan Mode Controler 🎛 GUI App For <a href="https://github.com/hackbnw/faustus">hackbnw/faustus</a> Driver Module For ASUS TUF Gaming Series Laptops💻

<img src="https://github.com/legacyO7/TUF-Control-FA706/raw/master/images/ss.png"/> 

## Automated installation
<ol>
  <li><code>git clone https://github.com/legacyO7/TUF-Control-FA706.git</code></li>
  <li><code>cd TUF-Control-FA706/</code></li>
  <li><code>./setup.sh</code></li>
</ol>

## How to compile .deb package
<ol>
  <li><code>sudo apt-get install nodejs npm</code></li>
  <li><code>git clone https://github.com/legacyO7/TUF-Control-FA706.git</code></li>
  <li><code>cd TUF-Control-FA706/</code></li>
  <li><code>npm install</code></li>
  <li><code>sudo npm install electron-packager -g</code></li>
  <li><code>npm run-script build</code></li>
  <li><code>sudo npm install -g electron-installer-debian</code></li>
  <li><code>electron-installer-debian --src dist/tufcontrol-electron-linux-x64/ --dest dist/installers/ --arch amd64</code></li>
  <li><code>cd dist/installers/</code></li>
  <li><code>sudo dpkg -i tufcontrol-electron_1.0.0_amd64.deb</code></li>
</ol>