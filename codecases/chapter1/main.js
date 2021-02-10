
function playSound(id){
	var audio = document.getElementById(id);
	if (audio !== null){
		audio.play();
	}
}