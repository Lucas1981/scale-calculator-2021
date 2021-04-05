/* Constants */

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const key = document.getElementById("key");
const note = document.getElementById("note");
const mode = document.getElementById("mode");
const chordStyle = document.getElementById("chordStyle");
const dots = document.getElementById("displayDots");
const rings = document.getElementById("displayRings");

/* Variables */

let imagePromises;
let activeScale;
let activeMode;
let inversion;
let displayToggle;
let showThirdsFlag, showSeventhsFlag, showAltFlag, showSusFlag;
let diationicFlag;
let diatonic;
let alternateIndex;
let alternateFlag;
let alternate;
let susFlag;
let audioQueue;
let dotsSetting;
let ringsSetting;
let guitar;
let chordSettings;

/* Arrays */

const mySound = new Array();
const activeKey = new Array();
const pianoImage = new Image();
const altChords = new Array();
const activeSusChords = new Array();
const diatonicScale = new Array();
const audioChannels = new Array();

/* Classes */

class GuitarType {
	constructor() {
		this.fretBoard = new Array();
		this.scale = new Array();
		this.noteNames = new Array();
		this.romanNames = new Array();
		this.relations = new Array();
		this.chords = new Array();
		this.tuning = new Array();
		this.fretsPerLine = null;
		this.strings = null;
		this.fretImageNames = new Array();
		this.fretImages = new Array();
		this.scaleImageNames = new Array();
		this.scaleImages = new Array();
		this.chordImageNames = new Array();
		this.chordImages = new Array();
		this.note = null;
	}
}

class ChordSettingsType {
	constructor(volume = null, speed = null) {
		this.volume = volume;
		this.speed = speed;
	}
}

/* Functions */

function initiateImages() {
	const promises = [];

	guitar.fretImageNames = ["open-fret.png", "fret.png", "fret-met-stip-onder.png", "fret-met-stip-boven.png"];
	for(let i = 0; i < guitar.fretImageNames.length; i++) {
		promises.push(new Promise(resolve => {
			guitar.fretImages[i] = new Image();
			guitar.fretImages[i].src = "images/" + guitar.fretImageNames[i];
			guitar.fretImages[i].onload = resolve;
		}));
	}

	guitar.scaleImageNames = ["blue-dot.png", "red-dot.png"];
	for(let i = 0; i < guitar.scaleImageNames.length; i++) {
		promises.push(new Promise(resolve => {
			guitar.scaleImages[i] = new Image();
			guitar.scaleImages[i].src = "images/" + guitar.scaleImageNames[i];
			guitar.scaleImages[i].onload = resolve;
		}));
	}

	guitar.chordImageNames = ["yellow-hoop.png", "orange-hoop.png", "green-hoop.png", "dark-green-hoop.png"];
	for(let i = 0; i < guitar.chordImageNames.length; i++) {
		promises.push(new Promise(resolve => {
			guitar.chordImages[i] = new Image();
			guitar.chordImages[i].src = "images/" + guitar.chordImageNames[i];
			guitar.chordImages[i].onload = resolve;
		}));
	}

	promises.push(new Promise(resolve => {
		pianoImage.src = "images/piano.png";
		pianoImage.onload = resolve;
	}));

	return promises;
}

function initiateSounds() {
	const promises = [];

	for(i = 0; i < 48; i++) {
		mySound[i] = new Audio();
		if("" != mySound[i].canPlayType("audio/mp3")) {
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

	for(i = 0; i < 32; i++) audioChannels[i] = new Audio();
	audioQueue = 0;

	return promises;
}

function initiateChordSettings() {
	chordSettings = new ChordSettingsType();
	chordSettings.volume = .25;
	chordSettings.speed = 150;
}

function initiateGuitar() {
	guitar = new GuitarType();

	guitar.fretsPerLine = 25; // 24 + the open position
	guitar.strings = 6;

	guitar.fretBoard = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
						0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
						0, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1,
						0, 1, 1, 3, 1, 3, 1, 3, 1, 3, 1, 1, 1, 1, 1, 3, 1, 3, 1, 3, 1, 3, 1, 1, 1,
						0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
						0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3];

	guitar.tuning = [0, 7, 3, 10, 5, 0]; 	// E A D G B E = [0, 7, 3, 10, 5, 0]
	// guitar.tuning = [8, 0, 5, 10, 3, 8];	// C G D A E C = [8, 0, 5, 10, 3, 8]
}

function initiateVariables() {
	let i, j;
	const ua = window.navigator.userAgent;
  const msie = ua.indexOf("MSIE "); // Detect IE

	for(i = 0; i < chords.length; i++) {
		altChords[i] = new Array();
		for(j = 0; j < chords.length; j++) altChords[i][j] = 0;
	}

	showThirdsFlag = true;
	showSeventhsFlag = true;
	showAltFlag = false;
	showSusFlag = false;
	diatonicFlag = false;
	alternateFlag = false;

	canvas.width = 800;
	canvas.height = 192;
}
