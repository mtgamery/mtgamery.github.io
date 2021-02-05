$(function() {
    $("#next").hide();

    $('#intro').bind('ended', function() {
		$("#next").show();
	});

	$("#next").click(function(){
		window.location.replace("Scene1.html");
	});
});
