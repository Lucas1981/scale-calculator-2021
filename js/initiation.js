/* Constants */

const TRIAD = 1;
const SEVENTH = 0;
const ALTERNATIVE = 0;
const REGULAR = 1;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const key = document.getElementById("key");
const note = document.getElementById("note");
const mode = document.getElementById("mode");
const chordStyle = document.getElementById("chordStyle");
const dots = document.getElementById("displayDots");
const rings = document.getElementById("displayRings");

/* Variables */

let imageCounter, totalImages;
let audioCounter, totalAudio;
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

/* Arrays */

const mySound = new Array();
const activeKey = new Array();
const pianoImage = new Image();
const altChords = new Array();
const activeSusChords = new Array();
const diatonicScale = new Array();
const audioChannels = new Array();

// Piano key jump units
const pianoJumps = [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26];
const pianoKeys = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];

// Key name index
keys = [	["A", "B", "C", "D", "E", "F", "G",
			 "A", "B", "C", "D", "E", "F", "G",
			 "A", "B", "C", "D", "E", "F", "G"],
			[2, 1, 2, 2, 1, 2, 2,
			 2, 1, 2, 2, 1, 2, 2,
             2, 1, 2, 2, 1, 2, 2] ];

// The scales are here duplicated so the modes can reach
const scales = [  [2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1], // major
				[2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2], // minor
				[2, 1, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 1], // harmonic minor
				[2, 1, 2, 2, 1, 3, 1, 2, 1, 2, 2, 1, 3, 1], // melodic minor
				[2, 1, 3, 1, 1, 3, 1, 2, 1, 3, 1, 1, 3, 1], // hungarian gypsy minor
				[2, 1, 3, 1, 1, 2, 2, 2, 1, 3, 1, 1, 2, 2], // gypsy
				[1, 2, 2, 2, 1, 3, 1, 1, 2, 2, 2, 1, 3, 1], // neapolitan minor
				[1, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1], // neapolitan major
				[1, 3, 1, 2, 1, 3, 1, 1, 3, 1, 2, 1, 3, 1], // flamenco
				[1, 3, 1, 2, 1, 2, 2, 1, 3, 1, 2, 1, 2, 2], // phrygian dominant
				[2, 1, 3, 1, 2, 1, 2, 2, 1, 3, 1, 2, 1, 2] ]; // ukranian dorian

const chords = [  [0, 3, 7, 10], // minor 7th
				[0, 4, 7, 11], // major 7th
				[0, 4, 7, 10], // dominant 7th
				[0, 3, 6, 10], // half-diminished 7th

				[0, 3, 7, 11], // minor-major 7th
				[0, 3, 6, 9], // diminished 7th
				[0, 4, 8, 11], // augmented major 7th
				[0, 4, 8, 10], // augmented 7th

				[0, 4, 6, 10], // dominant 7th flat 5
				[0, 3, 6, 11], // diminished major 7th
				[0, 2, 6, 9], // dominant 6/5
				[0, 3, 7, 9], // half-diminished 6/5

				[0, 2, 6, 10] ]; // augmented 6/5

const susChord = [0, 5, 7]; // Sus2 chord


const triadRelations = [	["R", "3", "5"],
						["6", "R", "3"],
						["4", "6", "R"] ];

const seventhRelations = [["R", "3", "5", "7"],
						["6", "R", "3", "5"],
						["4", "6", "R", "3"],
						["2", "4", "6", "R"]];

const susRelations = [["R", "4", "5"],
					["5", "R", "2"],
					["4", "7", "R"]];

const chordNames = [	"Minor 7th",
					"Major 7th",
					"Dominant 7th",
					"Half-diminished 7th",
					"Minor-major 7th",
					"Diminished 7th",
					"Augmented major 7th",
					"Augmented 7th",
					"Dominant 7th flat 5",
					"Diminished major 7th",
					"Dominant 6/5",
					"Half-diminished 6/5",
					"Augmented 6/5" ];

const triadChords = [0, 1, 1, 2, 0, 2, 3, 3, 4, 2, 5, 0, 5]; // We can use the seventh chord as an index for this

const triadChordNames = [ "Minor",
					"Major",
					"Diminished",
					"Augmented",
					"Major diminished",
					"Diminished sus2" ];

const roman = ["I", "II", "III", "IV", "V", "VI", "VII"];

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

/* Instantiate the classes */

var guitar = new GuitarType();
var chordSettings = new ChordSettingsType();

/* Functions */

function initiateImages() {
	imageCounter = 0;
	totalImages = 0;

	guitar.fretImageNames = ["open-fret.png", "fret.png", "fret-met-stip-onder.png", "fret-met-stip-boven.png"];
	for(i = 0; i < guitar.fretImageNames.length; i++) {
		totalImages++;
		guitar.fretImages[i] = new Image();
		guitar.fretImages[i].src = "images/" + guitar.fretImageNames[i];
		guitar.fretImages[i].onload = function(){imageCounter++;}
	}

	guitar.scaleImageNames = ["blue-dot.png", "red-dot.png"];
	for(i = 0; i < guitar.scaleImageNames.length; i++) {
		totalImages++;
		guitar.scaleImages[i] = new Image();
		guitar.scaleImages[i].src = "images/" + guitar.scaleImageNames[i];
		guitar.scaleImages[i].onload = function(){imageCounter++;}
	}

	guitar.chordImageNames = ["yellow-hoop.png", "orange-hoop.png", "green-hoop.png", "dark-green-hoop.png"];
	for(i = 0; i < guitar.chordImageNames.length; i++) {
		totalImages++;
		guitar.chordImages[i] = new Image();
		guitar.chordImages[i].src = "images/" + guitar.chordImageNames[i];
		guitar.chordImages[i].onload = function(){imageCounter++;}
	}

	totalImages++;
	pianoImage.src = "images/piano.png";
	pianoImage.onload = function(){imageCounter++;}
}

function initiateSounds() {
	audioCounter = 0;
	totalAudio = 0;

	for(i = 0; i < 48; i++) {
		totalAudio++;
		mySound[i] = new Audio();
		if("" != mySound[i].canPlayType("audio/mp3"))
			mySound[i].src = "audio/" + i.toString() + ".mp3"; // IE only supports mp3
		else
			mySound[i].src = "audio/" + i.toString() + ".wav";

		mySound[i].preload = 'auto';
		mySound[i].load();
		mySound[i].addEventListener("loadeddata", function(){
			console.log("Audio file " + audioCounter + " loaded");
			audioCounter++;
		});
	}

	for(i = 0; i < 32; i++) audioChannels[i] = new Audio();
	audioQueue = 0;
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

	guitar.fretsPerLine = 25; // 24 + the open position
	guitar.strings = 6;

	chordSettings.volume = .25;
	chordSettings.speed = 150;

	guitar.fretBoard = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
						0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
						0, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1,
						0, 1, 1, 3, 1, 3, 1, 3, 1, 3, 1, 1, 1, 1, 1, 3, 1, 3, 1, 3, 1, 3, 1, 1, 1,
						0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
						0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3];

	guitar.tuning = [0, 7, 3, 10, 5, 0]; 	// E A D G B E = [0, 7, 3, 10, 5, 0]
	// guitar.tuning = [8, 0, 5, 10, 3, 8];	// C G D A E C = [8, 0, 5, 10, 3, 8]

	initiateImages();
	initiateSounds();
}
