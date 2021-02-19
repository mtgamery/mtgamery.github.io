
var player;

$(function() {
	$("#next").click(function(){
		window.location.href = "scene1.html";
	});
});

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
      	height: '480',
      	width: '852',
      	videoId: 'GZTi-XJXKd8',
      	playerVars: { 
      		'rel': 0,
      		'controls': 1,
      		'autoplay': 1
      	},
      	events: {
        	'onReady': onPlayerReady,
        	'onStateChange': onPlayerStateChange
  		}
	});
}

function onPlayerReady(event) {
	event.target.playVideo();
}

function onPlayerStateChange(event) {
	if (event.data === YT.PlayerState.ENDED) {
		$("#next").fadeIn(100);
	}
}