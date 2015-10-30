/* jshint browser: true */

var video = $('#video')[0];
var video_sources = [];
var cam_options;
var prefered_video;
var ctx;
var is_ready = false;

function error_handle(error) {
    window.console.log('Video capture error: ', error.code);
}

function success_handle(stream) {
    video.src = window.URL.createObjectURL(stream);
    video.play();
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

if (typeof MediaStreamTrack === 'undefined') {
    alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
} else {
    window.MediaStreamTrack.getSources(function(sources) {
        for (var i = 0; i !== sources.length; ++i) {
            var source = sources[i];

            if (source.kind === 'video') {
                if (source.facing === 'environment') {
                    prefered_video = source;
                }
                // console.log(source);
                video_sources.push( source );
            }
        }

        var video_source_id;
        if (prefered_video) {
            video_source_id = prefered_video.id;
        } else {
            video_source_id = video_sources[0].id;
        }

        var constraints = {
            audio: false,
            video: {
                optional: [{sourceId: video_source_id}]
            }
        };

        navigator.getUserMedia(constraints, success_handle, error_handle);
    });
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

$(document).ready(function() {
    $('#canvas').attr('width', $(window).width() );
    $('#canvas').attr('height', $(window).height() );
    ctx = $('#canvas')[0].getContext('2d');
    is_ready = true;
    // ctx.drawImage(video, 0, 0);
});

function render() {
    if (is_ready) {
        ctx.drawImage(video, 0, 0);
    }
}
