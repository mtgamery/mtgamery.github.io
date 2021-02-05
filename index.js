$(function() {
	
	loadContent();

	$("#youtube").click(function(){
		window.open("https://www.youtube.com/channel/UCmydpynciKTM5SObIzbMKFg");
	});

	$("#chapter1").click(function(){
		window.location.href = "codecases/chapter1/intro.html";
	});
});

function loadContent(){
	$("#title").attr("src","https://docs.google.com/uc?export=download&id=1w4TLBFwztL3n4hRrI6jAVDq4hbquu17F");
	$("#youtube").attr("src","https://docs.google.com/uc?export=download&id=1EHIzdtEp_5yOrw4aZL_DS3H0mYvRCgC0");
	$("#chapter1").attr("src","https://docs.google.com/uc?export=download&id=1FX_1o_kPeLiBL09kBRA18nuoxiVtTHC4");
}
