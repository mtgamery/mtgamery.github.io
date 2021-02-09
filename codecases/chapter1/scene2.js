$(function() {
    
	loadContent();
	addEventHandlers();

    document.addEventListener('mousemove', updateSpotlight);
    document.addEventListener('touchmove', updateSpotlight);

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

	$("#blackscreenStart").click(function(){
		rain1Audio.play();
		$(this).fadeOut(300);
	});

	updateSpotlight();

	var comboArray = [0, 0, 0, 0];
	var combination = [1, 1, 0, 0];
		
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
	        	// do something
	        }
		}
	});
});

function loadContent(){
	$("#frontdoor").attr("src","images/abandoned_home.jpg");
	$("#padlock").attr("src","images/padlock.png");
}

function addEventHandlers(){
	$("#padlockArea").click(function(e){
		e.stopImmediatePropagation();
		e.preventDefault();
		$("#blackscreenBackground").fadeIn(500);
		$("#divPadlock").fadeIn(500);
		$("#back").fadeIn(500);
    });

    $("#back").click(function(e){
		e.stopImmediatePropagation();
		e.preventDefault();
		$("#divPadlock").fadeOut(500);
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
	$("#frontdoor").attr("src","images/abandoned_home_unlocked.jpg")
	$("#frontdoor").attr("usemap", "");
	playSound("unlock");
	setTimeout(function() {
		playSound("correct");
	},1000);
	$("#back").hide();
	$("#padlock").attr("src","images/padlock_open.png");
	setTimeout(function(){
		$("#next").fadeIn(1000);
		$("#divPadlock").fadeOut(500);
		$("#blackscreenBackground").fadeOut(500);
	},3000);
}