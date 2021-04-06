import { chords } from './consts.js';

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

const state = {
	activeScale: null,
	activeMode: null,
	inversion: null,
	displayToggle: null,
	diatonic: null,
	alternateIndex: null,
	alternate: null,
	dotsSetting: null,
	ringsSetting: null,
	chordSettings: null,
	guitar: null,
	// Flags
	showThirdsFlag: null,
	showSeventhsFlag: null,
	showAltFlag: null,
	showSusFlag: null,
	diatonicFlag: null,
	alternateFlag: null,
	susFlag: null,
};

/* Arrays */

const activeKey = new Array();
const pianoImage = new Image();
const altChords = new Array();
const activeSusChords = new Array();
const diatonicScale = new Array();

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

	state.guitar.fretImageNames = ["open-fret.png", "fret.png", "fret-met-stip-onder.png", "fret-met-stip-boven.png"];
	for(let i = 0; i < state.guitar.fretImageNames.length; i++) {
		promises.push(new Promise(resolve => {
			state.guitar.fretImages[i] = new Image();
			state.guitar.fretImages[i].src = "images/" + state.guitar.fretImageNames[i];
			state.guitar.fretImages[i].onload = resolve;
		}));
	}

	state.guitar.scaleImageNames = ["blue-dot.png", "red-dot.png"];
	for(let i = 0; i < state.guitar.scaleImageNames.length; i++) {
		promises.push(new Promise(resolve => {
			state.guitar.scaleImages[i] = new Image();
			state.guitar.scaleImages[i].src = "images/" + state.guitar.scaleImageNames[i];
			state.guitar.scaleImages[i].onload = resolve;
		}));
	}

	state.guitar.chordImageNames = ["yellow-hoop.png", "orange-hoop.png", "green-hoop.png", "dark-green-hoop.png"];
	for(let i = 0; i < state.guitar.chordImageNames.length; i++) {
		promises.push(new Promise(resolve => {
			state.guitar.chordImages[i] = new Image();
			state.guitar.chordImages[i].src = "images/" + state.guitar.chordImageNames[i];
			state.guitar.chordImages[i].onload = resolve;
		}));
	}

	promises.push(new Promise(resolve => {
		pianoImage.src = "images/piano.png";
		pianoImage.onload = resolve;
	}));

	return promises;
}

function initiateChordSettings() {
	state.chordSettings = new ChordSettingsType();
	state.chordSettings.volume = .25;
	state.chordSettings.speed = 150;
}

function initiateGuitar() {
	state.guitar = new GuitarType();

	state.guitar.fretsPerLine = 25; // 24 + the open position
	state.guitar.strings = 6;

	state.guitar.fretBoard = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
						0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
						0, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1,
						0, 1, 1, 3, 1, 3, 1, 3, 1, 3, 1, 1, 1, 1, 1, 3, 1, 3, 1, 3, 1, 3, 1, 1, 1,
						0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
						0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3];

	state.guitar.tuning = [0, 7, 3, 10, 5, 0]; 	// E A D G B E = [0, 7, 3, 10, 5, 0]
	// guitar.tuning = [8, 0, 5, 10, 3, 8];	// C G D A E C = [8, 0, 5, 10, 3, 8]
}

function initiateVariables() {
	const ua = window.navigator.userAgent;
  const msie = ua.indexOf("MSIE "); // Detect IE

	for (let i = 0; i < chords.length; i++) {
		altChords[i] = new Array();
		for (let j = 0; j < chords.length; j++) altChords[i][j] = 0;
	}

	state.showThirdsFlag = true;
	state.showSeventhsFlag = true;
	state.showAltFlag = false;
	state.showSusFlag = false;
	state.diatonicFlag = false;
	state.alternateFlag = false;

	canvas.width = 800;
	canvas.height = 192;
}

export {
	key,
	note,
	mode,
	dots,
	rings,
	pianoImage,
	initiateVariables,
	initiateChordSettings,
	initiateGuitar,
	initiateImages,
	context,
	activeKey,
	activeSusChords,
	altChords,
	diatonicScale,
	state
};
