/* jshint browser: true */

var video = $('#video')[0];
var canvas = document.getElementById('canvas');
var overlay = document.getElementById('overlay');
var video_sources = [];
var cam_options;
var prefered_video;
var ctx;
var is_ready = false;
var markers;
var overlay_ctx;
var selfie_mode = location.search.split('selfie=')[1];

var detector = new AR.Detector();

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
                if (source.facing === 'environment' && !selfie_mode) {
                    prefered_video = source;
                }
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
    canvas.width = 640;
    canvas.height = 480;
    overlay.width = 640;
    overlay.height = 480;
    ctx = $('#canvas')[0].getContext('2d');
    overlay_ctx = $('#overlay')[0].getContext('2d');
    overlay_ctx.fillStyle = '#ff0000';
    is_ready = true;
});

function render() {
    if (is_ready) {
        ctx.drawImage(video, 0, 0);
        var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // console.log(image_data);
        markers = detector.detect(image_data);

        if (detector.candidates.length === 2) {
            overlay_ctx.clearRect(0, 0, overlay.width, overlay.height);

            var marker_width;
            var first_corner;
            if ( detector.candidates[0][0].x < detector.candidates[0][2].x) {
                marker_width = detector.candidates[0][1].x - detector.candidates[0][0].x;
                // overlay_ctx.fillRect( detector.candidates[0][0].x, detector.candidates[0][0].y, marker_width, 20 );
                first_corner = detector.candidates[0][0];
            } else {
                marker_width = detector.candidates[0][0].x - detector.candidates[0][3].x;
                // overlay_ctx.fillRect( detector.candidates[0][3].x, detector.candidates[0][3].y, marker_width, 20 );
                first_corner = detector.candidates[0][3];
            }

            marker_width *= 2.25;
            var image_height = (marker_width / 200) * 233;
            overlay_ctx.drawImage( $('#image')[0], first_corner.x - (marker_width * 0.2), first_corner.y - (image_height * 1.5), marker_width, image_height );

        }
    }
}
