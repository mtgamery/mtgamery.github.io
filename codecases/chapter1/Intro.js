$(function() {
    $("#next").hide();

    $('#intro').bind('ended', function() {
		$("#next").show();
	});

	$("#next").click(function(){
		window.location.href = "Scene1.html";
	});
});
