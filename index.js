$(function() {
	
	loadContent();

	$("#youtube").click(function(){
		window.open("https://www.youtube.com/channel/UCmydpynciKTM5SObIzbMKFg");
	});

	$("#investigation").click(function(){
		window.open("https://forms.gle/BG3RkWhKw9zYRS1y5");
	});

	$("#cc_chapter1").click(function(){
		window.open("codecases/chapter1/intro.html");
	});
});

function loadContent(){
	$("#title").attr("src","https://docs.google.com/uc?export=download&id=1w4TLBFwztL3n4hRrI6jAVDq4hbquu17F");
	$("#youtube").attr("src","https://docs.google.com/uc?export=download&id=1EHIzdtEp_5yOrw4aZL_DS3H0mYvRCgC0");
	$("#investigation").attr("src","https://docs.google.com/uc?export=download&id=1o7CNLDqOgzyvjXZGfRR2aLbH2V6uAiqI");	
	$("#cc_chapter1").attr("src","https://docs.google.com/uc?export=download&id=12r0yr0xorGZvdDkGBs4CMIS160-3LLzU");
}
