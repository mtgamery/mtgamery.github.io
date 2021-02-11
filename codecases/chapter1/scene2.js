$(function() {
    
	loadContent();
	addEventHandlers();

    document.addEventListener('mousemove', updateSpotlight);
    document.addEventListener('touchmove', updateSpotlight);

    rainSound.on('fade', function(){
  		var rain = rainSound2.play();
  		rainSound2.fade(0.9, 1, 57000, rain);
	});

	rainSound2.on("fade", function() {
		var rain = rainSound.play();
		rainSound.fade(0.9, 1, 57000, rain);
	});

	$("#blackscreenStart").click(function(){
		var rain = rainSound.play();
		rainSound.fade(0.9, 1, 57000, rain);
		$(this).fadeOut(300);
	});

	updateSpotlight();

	var comboArray = [0, 0, 0, 0];
	var combination = [1, 0, 8, 1];
		
	var gridIncrement = $( ".lockDial ul" ).css('line-height').replace('px', '') / 2;
	var numNums = $( ".lockDial:eq(0) ul li" ).length;
	var halfHeight = gridIncrement * numNums;
	var initTop = -(halfHeight - gridIncrement);

	$( ".lockDial ul" ).css('top', initTop);
	
	$( ".lockDial ul" ).draggable({
		grid: [ 0, gridIncrement ],
		axis: 'y',
		drag: function(){
			var dragDir = $(this).css('top').replace('px', '') < initTop ? "up" : "down";

			if (dragDir == "up") {
				var curNum = parseInt($(this).find('li:last-child').text()) + 1;		
				if (curNum > 9 ) { curNum = 0 }

				$(this).append('<li>'+curNum+'</li>');
			}
			else {
				var curNum = parseInt($(this).find('li:first-child').text()) - 1;
				if (curNum < 0) { curNum = 9 }	

				var thisTop = parseInt($(this).css('margin-top').replace('px', ''));		
				$(this).css({
					marginTop: thisTop - (gridIncrement * 2)
				});
				
				$(this).prepend('<li>'+curNum+'</li>');
			}
		},
		stop: function(){
			var negOrPos = $(this).css('margin-top').replace('px', '') > 0 ? 1 : -1;
			var thisTopTotal = parseInt($(this).css('top').replace('px', '')) + Math.abs(initTop);
			var marginMinified = parseInt(Math.abs($(this).css('margin-top').replace('px', ''))) - thisTopTotal;

			var numIncs = Math.floor(marginMinified / (halfHeight * 2));
			var totalDif = numIncs * (halfHeight * 2);
			var topTen = (marginMinified - totalDif) * negOrPos;
			var activeIndex = Math.abs(topTen / (gridIncrement * 2)) + (halfHeight / (gridIncrement * 2));
			
			$(this).attr("data-combo-num", $(this).find('li').eq(activeIndex).text()).css({
				top: -270,
				marginTop: topTen
			}).find('li').slice(20).remove();
			
			for (var i = 0; i < $( ".lockDial ul" ).length; i++){
				comboArray[i] = $( ".lockDial ul:eq(" + i + ")").attr("data-combo-num");
			}
			
			if (comboArray == "" + combination) {
				$('.lockDial ul').draggable('disable');
				correct();
			}
	        else {
	        	clickSound.play();
	        }
		}
	});
});

var rainSound = new Howl({
	src: ["../media/rain.mp3"]
});

var rainSound2 = new Howl({
	src: ["../media/rain.mp3"]
});

var clickSound = new Howl({
	src: ["../media/click.mp3"]
});

var pageFlipSound = new Howl({
	src: ["../media/pageflip2.mp3"]
});

var unlockSound = new Howl({
	src: ["../media/unlock.mp3"]
});

var correctSound = new Howl({
	src: ["../media/correct.mp3"]
});

function loadContent(){
	$("#frontdoor").attr("src","images/AbandonedHome.jpg");
	$("#padlock").attr("src","images/Padlock.png");
	$("#article").attr("src","images/Article.png");
}

function addEventHandlers(){
	$("#padlockArea").click(function(e){
		e.stopImmediatePropagation();
		e.preventDefault();
		$("#blackscreenBackground").fadeIn(500);
		$("#divPadlock").fadeIn(500);
		$("#back").fadeIn(500);
    });

    $("#articleArea").click(function(e){
		e.stopImmediatePropagation();
		e.preventDefault();
		pageFlipSound.play();
		$("#blackscreenBackground").fadeIn(500);
		$("#article").fadeIn(500);
		$("#back").fadeIn(500);
    });

    $("#doorArea").click(function(e){
		e.stopImmediatePropagation();
		e.preventDefault();
		$("#frontdoor").attr("src","images/AbandonedHomeOpen.jpg")
		$("#doorArea").remove();
		$("#next").fadeIn(1000);
    });

    $("#back").click(function(e){
		e.stopImmediatePropagation();
		e.preventDefault();
		$("#divPadlock").fadeOut(500);
		$("#article").fadeOut(500);
		$("#blackscreenBackground").fadeOut(500);
		$("#back").fadeOut(500);
    });
}

function updateSpotlight(e){
	var x = 0;
	var y = 0;

	if (typeof e !== 'undefined') {
	 	x = e.clientX || e.touches[0].clientX;
	 	y = e.clientY || e.touches[0].clientY;
 	}

 	document.documentElement.style.setProperty('--cursorX', x + 'px');
 	document.documentElement.style.setProperty('--cursorY', y + 'px');
}

function correct() {
	$("#frontdoor").attr("src","images/AbandonedHomeUnlocked.jpg")
	$("#padlockArea").remove();
	$("#articleArea").remove();
	$("#doorArea").attr("coords","319,197,540,428");

	unlockSound.play();
	setTimeout(function() {
		correctSound.play();
	},1000);
	$("#back").hide();
	$("#padlock").attr("src","images/PadlockOpen.png");
	setTimeout(function(){
		$("#divPadlock").fadeOut(500);
		$("#blackscreenBackground").fadeOut(500);
	},3000);
}