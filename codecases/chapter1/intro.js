$(function() {
    $("#next").hide();

    $('#intro').bind('ended', function() {
		$("#next").show();
	});

	$("#next").click(function(){
		window.location.href = "scene1.html";
	});
});
