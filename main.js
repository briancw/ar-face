var inital_bg_offset = 20;
var bg_multipler = 1.5;
var front_multipler = 1;

var gx = 0;
var gy = 0;
var orientation = window.orientation;

$(document).ready(function(){
    $('.page_background').css('background-position-x', -inital_bg_offset + 'px');
    $('.page_background').css('background-position-y', -inital_bg_offset + 'px');

    window.ondevicemotion = function(e) {

        // console.log(e.accelerationIncludingGravity.x);
        gx = e.accelerationIncludingGravity.x;
        gy = e.accelerationIncludingGravity.y;

        // $('.grav_x').html( gx );
        // $('.grav_y').html( gy );
    };

    // window.addEventListener("orientationchange", function() {
    //   alert(window.orientation);
    // }, false);
});

function render() {
    if(window.orientation === 0) {
        $('.page_background').css('background-position-x', ( (gx * bg_multipler) - inital_bg_offset) + 'px');
        $('.page_background').css('background-position-y', ( -(gy * bg_multipler) - inital_bg_offset) + 'px');

        $('.parallax_wrapper').css('left', -(gx * front_multipler) + 'px');
        $('.parallax_wrapper').css('top', (gy * front_multipler) + 'px');
    } else {
        $('.page_background').css('background-position-x', ( -(gy * bg_multipler) - inital_bg_offset) + 'px');
        $('.page_background').css('background-position-y', ( (gx * bg_multipler) - inital_bg_offset) + 'px');

        $('.parallax_wrapper').css('left', (gy * front_multipler) + 'px');
        $('.parallax_wrapper').css('top', -(gx * front_multipler) + 'px');
    }
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function animloop(){
  requestAnimFrame(animloop);
  render();
})();