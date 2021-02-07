$(function() {
    
	loadContent();

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

	$(".blackscreen").click(function(){
		rain1Audio.play();
		$(this).fadeOut(300);
	});

	updateSpotlight();
});

function loadContent(){
	$("#frontdoor").attr("src","https://docs.google.com/uc?export=download&id=1qGHBETgF3ev4w8qMFM6vuPb4WpBoBmHE");
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