let audioQueue;
const audioChannels = [];
const mySound = [];
function initiateSounds() {
	const promises = [];

	for (let i = 0; i < 48; i++) {
		mySound[i] = new Audio();
		if ("" !== mySound[i].canPlayType("audio/mp3")) {
			mySound[i].src = "audio/" + i.toString() + ".mp3"; // IE only supports mp3
		} else {
			mySound[i].src = "audio/" + i.toString() + ".wav";
		}

		mySound[i].preload = 'auto';
		mySound[i].load();
		promises.push(new Promise(resolve => {
			mySound[i].addEventListener("loadeddata", resolve);
		}));
	}

	for (let i = 0; i < 32; i++) audioChannels[i] = new Audio();
	audioQueue = 0;

	return promises;
}

function scheduleSound(index, timeStretch, volume, speed) {
	setTimeout(function() {
		/*var track = mySound[index].cloneNode();
		track.volume = volume;
		track.play();*/
		audioChannels[audioQueue].src = mySound[index].src
		audioChannels[audioQueue].load();
		audioChannels[audioQueue].volume = volume;
		audioChannels[audioQueue].play();

		if(audioQueue === 31) audioQueue = 0;
		else audioQueue++;
	}, speed * timeStretch);
}

export {
	initiateSounds,
	scheduleSound,
}
