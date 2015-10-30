/* jshint browser: true */
// alert('t');
var inital_bg_offset = 20;
var bg_multipler = 1.5;
var front_multipler = 1;
var window_width;

var gx = 0;
var gy = 0;
var orientation = window.orientation;
var comp;

$(document).ready(function() {
    window_width = $(window).width();
    window.ondevicemotion = function(e) {
        gx = e.accelerationIncludingGravity.x;
        // gx = e.acceleration.x;
        gy = e.accelerationIncludingGravity.y;

        // $('.grav_x').html( gx );
        // $('.grav_y').html( gy );
    };
});

// document.getElementById("snap").addEventListener("click", function() {
//     context.drawImage(video, 0, 0, 640, 480);
// });

function render() {
    // $('.x_out').html(gx);
    var trans_x = (comp * Math.PI);

    if (trans_x > window_width) {
        // trans_x -= window_width;
        $('.x_out').html('Behind you!');
    } else {
        $('.x_out').html('');
    }

    $('.page_container').css('left', trans_x + 'px');
    // $('.x_out').html( trans_x + 'px ');
}

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

(function animloop() {
    requestAnimFrame(animloop);
    render();
})();

function compassHeading(alpha, beta, gamma) {

    // Convert degrees to radians
    var alphaRad = alpha * (Math.PI / 180);
    var betaRad = beta * (Math.PI / 180);
    var gammaRad = gamma * (Math.PI / 180);

    // Calculate equation components
    var cA = Math.cos(alphaRad);
    var sA = Math.sin(alphaRad);
    var cB = Math.cos(betaRad);
    var sB = Math.sin(betaRad);
    var cG = Math.cos(gammaRad);
    var sG = Math.sin(gammaRad);

    // Calculate A, B, C rotation components
    var rA = - cA * sG - sA * sB * cG;
    var rB = - sA * sG + cA * sB * cG;
    var rC = - cB * cG;

    // Calculate compass heading
    var compassHeading = Math.atan(rA / rB);

    // Convert from half unit circle to whole unit circle
    if (rB < 0) {
        compassHeading += Math.PI;
    } else if (rA < 0) {
        compassHeading += 2 * Math.PI;
    }

    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;

    return compassHeading;

}

window.addEventListener('deviceorientation', function(evt) {

  var heading = null;

  if(evt.absolute === true && evt.alpha !== null) {
    // heading = compassHeading(evt.alpha, evt.beta, evt.gamma);
    comp = compassHeading(evt.alpha, evt.beta, evt.gamma);
    // $('.x_out').html( comp );
  }

  // Do something with 'heading'...


}, false);

window.addEventListener("DOMContentLoaded", function() {
    // Grab elements, create settings, etc.
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        video = document.getElementById("video"),
        videoObj = { "video": true },
        errBack = function(error) {
            console.log("Video capture error: ", error.code);
        };

    // Put video listeners into place
    if(navigator.getUserMedia) { // Standard
        navigator.getUserMedia(videoObj, function(stream) {
            video.src = stream;
            video.play();
        }, errBack);
    } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
        navigator.webkitGetUserMedia(videoObj, function(stream){
            video.src = window.webkitURL.createObjectURL(stream);
            video.play();
        }, errBack);
    }
    else if(navigator.mozGetUserMedia) { // Firefox-prefixed
        navigator.mozGetUserMedia(videoObj, function(stream){
            video.src = window.URL.createObjectURL(stream);
            video.play();
        }, errBack);
    }
}, false);
