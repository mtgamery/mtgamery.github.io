$(function() {
    
	loadContent();

	$("#title").fadeIn(5000, function(){
		$("#start").fadeIn(1000);
	});

    rainSound.on('fade', function(){
  		var rain = rainSound2.play();
  		rainSound2.fade(0.9, 1, 57000, rain);
	});

	rainSound2.on("fade", function() {
		var rain = rainSound.play();
		rainSound.fade(0.9, 1, 57000, rain);
	});

	$("#start").click(function(){
		var rain = rainSound.play();
		rainSound.fade(0.9, 1, 57000, rain);
		$(this).hide();
		$("#desk").fadeIn(3000);
		$("#title").fadeOut(3000, function(){
			showSubtitle("These must be the houses that were hit", 4000, 0);
			showSubtitle("and the notes that were left behind.", 4000, 5000);
			setTimeout(function(){
				addEventHandlers();
				$("#deskMap_Map").addClass("cursor-pointer");
    			$("#deskMap_Folder").addClass("cursor-pointer");
			}, 10000)
		});
	});

    $('#map').mapster({
	    fillOpacity: 0.75,
	    render_highlight: {
	        fillColor: '2aff00',
	        stroke: true
	    },
	    render_select: {
	        fillColor: 'ff000c',
	        stroke: false
	    },
	    fadeInterval: 50,
	    mapKey: 'id',
	    onClick: function(data){
	    	if (data.selected) {
	    		if (locations.indexOf(data.key) === -1) {
	    			locations.push(data.key);
        		}
	    	}
	    	else {
	    		return false;
	    	}

	    	if (locations.length === 6){
	    		return checkAnswer();
	    	}
	    }
	});
});

var locations = [];
var options = 'GreggJonesGarciaChambersSilvaWaller';

var rainSound = new Howl({
	src: ["../media/rain_indoor.mp3"]
});

var rainSound2 = new Howl({
	src: ["../media/rain_indoor.mp3"]
});

var pageflip1Sound = new Howl({
	src: ["../media/pageflip1.mp3"]
});

var pageflip2Sound = new Howl({
	src: ["../media/pageflip2.mp3"]
});

var correctSound = new Howl({
	src: ["../media/correct.mp3"]
});

function addEventHandlers(){
	$("#deskMap_Map").click(function(e){
		e.stopImmediatePropagation();
		e.preventDefault();
		pageflip1Sound.play();
		$("#popup_Map").fadeIn(500);
		$("#back").fadeIn(500);
    });

	$("#deskMap_Folder").click(function(e){
		e.stopImmediatePropagation();
		e.preventDefault();
		pageflip2Sound.play();
		$("#popup_Folder").fadeIn(500);
		$("#back").fadeIn(500);
    });

    $("#back").click(function(e){
		e.stopImmediatePropagation();
		e.preventDefault();
		$("#popup_Map").fadeOut(500);
		$("#popup_Folder").fadeOut(500);
		$("#back").fadeOut(500);
    });

    $("#next").click(function(){
		window.location.href = "cutscene1.html";
	});
}

function checkAnswer(){
	var answer = locations.join('');
	if (options === answer) {
		correct();
		return true;
	}
	else {
		showSubtitle("That doesn't seem right.", 5000, 0);
		locations = [];
		$('.map-location').mapster('deselect');
		return false;
	}
}

function correct() {
	setTimeout(function() {
		correctSound.play();
	},1000);
	$("#back").hide();
	$("#map2").fadeIn(3000, function() {
		showSubtitle("Hmm... this looks promising.", 4000, 0);
		setTimeout(function(){
			$("#next").fadeIn(1000);
		},4000);
    });
}

function loadContent(){
	$("#title").attr("src","images/Title.png");
	$("#desk").attr("src","images/Desk.jpg" );
	$("#map").attr("src","images/PortviewMap.jpg");
	$("#map2").attr("src","images/PortviewMapArrow.jpg");
	$("#folder").attr("src","images/CallingCards.jpg");
}

function showSubtitle(text, duration, delay) {
	setTimeout(function(){
		$("#subtitle").html("");
		$("#subtitle").append("<p>" + text + "</p>");
		$("#subtitle").fadeIn(500)
			.delay(duration)
			.fadeOut(500);
	}, delay);
}
