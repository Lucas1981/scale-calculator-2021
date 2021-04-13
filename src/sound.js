let audioQueue;
const audioChannels = [];
const mySound = [];
import * as Tone from 'tone';
let instrument = null;
const noteMap = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const initiateSounds = () => {
	instrument = new Tone.Sampler({
		urls: {
			"C4": "C4.mp3",
			"D#4": "Ds4.mp3",
			"F#4": "Fs4.mp3",
			"A4": "A4.mp3",
		},
		release: 1,
		baseUrl: "https://tonejs.github.io/audio/salamander/",
	}).toDestination();

	return Tone.loaded();
};

// new Tone.PolySynth(Tone.Synth).toDestination();

const scheduleSound = (index, timeStretch, volume, speed) => {
	const note = `${noteMap[(4 + index) % 12]}${3 + parseInt((4 + index) / 12)}`;
	const now = Tone.now();
	const delay = timeStretch * speed;
	instrument.triggerAttack(note, now + delay);
	instrument.triggerRelease(note, now + delay + 1);
};

export {
	initiateSounds,
	scheduleSound,
}
