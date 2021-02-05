$(function() {
    $("#next").hide();

    $('#cutscene').bind('ended', function() {
		$("#next").show();
	});

	$("#next").click(function(){
		window.location.href = "scene2.html";
	});
});