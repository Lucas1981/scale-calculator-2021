function scheduleSound(index, timeStretch, volume, speed) {
	setTimeout(function() {
		/*var track = mySound[index].cloneNode();
		track.volume = volume;
		track.play();*/
		audioChannels[audioQueue].src = mySound[index].src
		audioChannels[audioQueue].load();
		audioChannels[audioQueue].volume = volume;
		audioChannels[audioQueue].play();

		if(audioQueue == 31) audioQueue = 0;
		else audioQueue++;
	}, speed * timeStretch);
}
