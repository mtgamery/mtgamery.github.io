
function playSound(id){
	var audio = document.getElementById(id);
	if (audio !== null){
		audio.play();
	}
}

async function playSoundAsync(id) {
	var audioElement = document.createElement('audio');
    audioElement.setAttribute("src", "../media/" + id + ".mp3");

    audioElement.addEventListener('ended', function() {
        this.remove();
    }, false);

	const res = await audioElement.play();
	return res;
}