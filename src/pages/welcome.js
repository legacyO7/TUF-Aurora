const { existsSync } = require('fs');
const paths = require('./path');

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');


function Pixel(x, y) {
    this.x = x;
    this.y = y;
    this.hue = Math.floor(Math.random() * 360);
    var direction = Math.random() > 0.5 ? -1 : 1;
    this.velocity = (Math.random() * 30 + 20) * 0.005 * direction;
}

Pixel.prototype.update = function() {
    this.hue += this.velocity;
};

Pixel.prototype.render = function(ctx) {
    var hue = Math.round(this.hue);
    ctx.fillStyle = 'hsl(' + hue + ', 100%, 50% )';
    ctx.fillRect(this.x, this.y, 1, 1);
}

var pixels = [
    new Pixel(0, 0),
    new Pixel(1, 0),
    new Pixel(0, 1),
    new Pixel(1, 1),
];

function animate() {
    pixels.forEach(function(pixel) {
        pixel.update();
        pixel.render(ctx);
    });
    requestAnimationFrame(animate);

    navigate();
}


function navigate() {

    setTimeout(function() {
        if (existsSync(`${paths.kModule}`)) {
            window.location.href = './pages/home.html';
        } else {
            document.getElementById("go").style.display = "block"
            document.getElementById("loader").style.display = "none"

        }
    }, 3000);
}

animate();