$(function() {
	
	loadContent();

	$("#chapter1").click(function(){
		window.location.replace("Chapter1.html");
	});
});

function loadContent(){
	$("#chapter1").attr("src","https://docs.google.com/uc?export=download&id=12r0yr0xorGZvdDkGBs4CMIS160-3LLzU");
}