const TRIAD = 1;
const SEVENTH = 0;
const ALTERNATIVE = 0;
const REGULAR = 1;

// Piano key jump units
const pianoJumps = [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26];
const pianoKeys = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];

// Key name index
const keys = [
	[
		"A", "B", "C", "D", "E", "F", "G",
		"A", "B", "C", "D", "E", "F", "G",
		"A", "B", "C", "D", "E", "F", "G"
	],
	[
		2, 1, 2, 2, 1, 2, 2,
		2, 1, 2, 2, 1, 2, 2,
		2, 1, 2, 2, 1, 2, 2
	]
];

// The scales are here duplicated so the modes can reach
const scales = [
	[2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1], // major
	[2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2], // minor
	[2, 1, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 1], // harmonic minor
	[2, 1, 2, 2, 1, 3, 1, 2, 1, 2, 2, 1, 3, 1], // melodic minor
	[2, 1, 3, 1, 1, 3, 1, 2, 1, 3, 1, 1, 3, 1], // hungarian gypsy minor
	[2, 1, 3, 1, 1, 2, 2, 2, 1, 3, 1, 1, 2, 2], // gypsy
	[1, 2, 2, 2, 1, 3, 1, 1, 2, 2, 2, 1, 3, 1], // neapolitan minor
	[1, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1], // neapolitan major
	[1, 3, 1, 2, 1, 3, 1, 1, 3, 1, 2, 1, 3, 1], // flamenco
	[1, 3, 1, 2, 1, 2, 2, 1, 3, 1, 2, 1, 2, 2], // phrygian dominant
	[2, 1, 3, 1, 2, 1, 2, 2, 1, 3, 1, 2, 1, 2] // ukranian dorian
];

const chords = [
	[0, 3, 7, 10], // minor 7th

	[0, 4, 7, 11], // major 7th
	[0, 4, 7, 10], // dominant 7th
	[0, 3, 6, 10], // half-diminished 7th

	[0, 3, 7, 11], // minor-major 7th
	[0, 3, 6, 9],  // diminished 7th
	[0, 4, 8, 11], // augmented major 7th
	[0, 4, 8, 10], // augmented 7th

	[0, 4, 6, 10], // dominant 7th flat 5
	[0, 3, 6, 11], // diminished major 7th
	[0, 2, 6, 9],  // dominant 6/5
	[0, 3, 7, 9],  // half-diminished 6/5

	[0, 2, 6, 10]  // augmented 6/5
];

const susChord = [0, 5, 7]; // Sus2 chord

const triadRelations = [
	["R", "3", "5"],
	["6", "R", "3"],
	["4", "6", "R"]
];

const seventhRelations = [
	["R", "3", "5", "7"],
	["6", "R", "3", "5"],
	["4", "6", "R", "3"],
	["2", "4", "6", "R"]
];

const susRelations = [
	["R", "4", "5"],
	["5", "R", "2"],
	["4", "7", "R"]
];

const chordNames = [
	"Minor 7th",
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
	"Augmented 6/5"
];

const triadChords = [0, 1, 1, 2, 0, 2, 3, 3, 4, 2, 5, 0, 5]; // We can use the seventh chord as an index for this

const triadChordNames = [
	"Minor",
	"Major",
	"Diminished",
	"Augmented",
	"Major diminished",
	"Diminished sus2"
];

const roman = ["I", "II", "III", "IV", "V", "VI", "VII"];

export {
	TRIAD,
	SEVENTH,
	ALTERNATIVE,
	REGULAR,
	pianoJumps,
	pianoKeys,
	keys,
	scales,
	chords,
	susChord,
	triadRelations,
	seventhRelations,
	susRelations,
	chordNames,
	triadChords,
	triadChordNames,
	roman
};
