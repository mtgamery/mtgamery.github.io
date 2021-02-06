$(function() {
    
	loadContent();

	$("#title").fadeIn(5000, function(){
		$("#start").fadeIn(1000);
	});

    var rain1Audio = document.getElementById("rain1");
	var rain2Audio = document.getElementById("rain2");

	rain1Audio.addEventListener('timeupdate', function(){
    	if ( this.currentTime > this.duration - 5 )
    	{
	        rain2Audio.play();
    	}
	});
	rain2Audio.addEventListener('timeupdate', function(){
    	if ( this.currentTime > this.duration - 5 )
    	{
	        rain1Audio.play();
    	}
	});

	$("#start").click(function(){
		rain1Audio.play();
		$(this).hide();
		$("#desk").fadeIn(3000);
		$("#title").fadeOut(3000, function(){
			showSubtitle("These must be the houses that were hit", 4000, 0);
			showSubtitle("and the notes that were left behind.", 4000, 5000);
			setTimeout(function(){
				addEventHandlers();
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

	$("#next").click(function(){
		window.location.href = "cutscene1.html";
	});
});

var locations = [];
var options = 'GreggJonesGarciaChambersSilvaWaller';

function addEventHandlers(){
	$("#deskMap_Map").click(function(e){
		e.stopImmediatePropagation();
		e.preventDefault();
		playSound("pageflip1")
		$("#popup_Map").fadeIn(500);
		$("#back").fadeIn(500);
    });

	$("#deskMap_Folder").click(function(e){
		e.stopImmediatePropagation();
		e.preventDefault();
		playSound("pageflip2")
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
		playSound("correct");
	},1000);
	$("#back").hide();
	$("#map2").fadeIn(3000, function() {
		showSubtitle("Hmm... this looks promising.", 4000, 0);
		setTimeout(function(){
			$("#next").fadeIn(3000);
		},4000);
    });
}

function loadContent(){
	$("#title").attr("src","https://docs.google.com/uc?export=download&id=12r0yr0xorGZvdDkGBs4CMIS160-3LLzU");
	$("#desk").attr("src","https://docs.google.com/uc?export=download&id=1SSpU00w_IXtxvBTKU8LVk8GMlcJU7FtG" );
	$("#map").attr("src","https://docs.google.com/uc?export=download&id=1VbWgjKDBR4EyF7I0beZUNphGT79eL1Bl");
	$("#map2").attr("src","https://docs.google.com/uc?export=download&id=1Bq0dMFvfEyJgXQ3vDUHJKBIptqt0Hcnn");
	$("#folder").attr("src","https://docs.google.com/uc?export=download&id=1B0UU4-wazeSQGgmt5kupyD17MWZbOT9Y");
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

function playSound(id){
	var audio = document.getElementById(id);
	audio.play();
}
