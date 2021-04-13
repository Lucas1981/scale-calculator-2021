import { SEVENTH, triadRelations, seventhRelations, susRelations, keys, scales, roman, chords, susChord } from './consts.js';
import state from './state.js';

const getNoteNames = () => {
	let i = 7;
	let keyIncrease = 0;
	let scaleIncrease = 0;
	let flatCorrection = 0;
	let sharpCorrection = 0;

	state.activeKey[0] = $("#note option:eq(" + $("#note")[0].selectedIndex + ")").attr("name");

	while (keys[0][i] !== state.activeKey[0].substring(0,1)) i++;
	if (state.activeKey[0].length > 1) {
		if (state.activeKey[0].substring(1,2) === "#") sharpCorrection = 1;
		if (state.activeKey[0].substring(1,2) === "b") flatCorrection = 1;
	}

	for (let j = 0; j < 7; j++) {
		state.activeKey[j+1] = keys[0][1+i+j];
		keyIncrease += keys[1][j+i];
		scaleIncrease += scales[state.activeScale][j];

		if (keyIncrease - sharpCorrection + flatCorrection > scaleIncrease) {
			for(let k = 0; k < ((keyIncrease - sharpCorrection + flatCorrection) - scaleIncrease); k++) {
				state.activeKey[j + 1] += "b";
			}
		}

		if (keyIncrease - sharpCorrection + flatCorrection < scaleIncrease) {
			for (let k = 0; k < (scaleIncrease - (keyIncrease - sharpCorrection + flatCorrection)); k++) {
				state.activeKey[j + 1] += "#";
			}
		}
	}
};

const resetScale = () => {
	for (let i = 0; i < state.guitar.fretsPerLine * state.guitar.strings; i++) {
		state.guitar.scale[i] = 0;
	}
};

const loadProperScale = () => {
	let i = 0;
	let index = 0;
	do {
		for (let j = 0; j < 4; j++) {
			state.guitar.noteNames[index + (j * 12)] = state.activeKey[i];
			state.guitar.romanNames[index + (j * 12)] = roman[i];
			if (index > 0) {
				state.guitar.scale[index + (j * 12)] = 1;
			} else {
				state.guitar.scale[index + (j * 12)] = 2; // Force the root-note in there
			}
		}
		index += scales[state.activeScale][i + state.activeMode]; // Get the church mode in there
		i++;
	} while (i < 7);
};

const findSeventhChords = () => {
	let scaleOffset = 0;
	for (let i = 0; i < 7; i++) { // For each step in the scale
		let foundChordFlag = false;
		let j = 0;
		while (foundChordFlag === false && j < chords.length) { // Check each possible chord
			let index = 0;
			foundChordFlag = true; // Innocent until proven guilty
			for (let k = 0; foundChordFlag === true && k < 4; k++) { // Check all intervals in the chord
				index = chords[j][k]; // Step to the next chord jump
				if (state.guitar.scale[scaleOffset + index] === 0) {
					foundChordFlag = false;
				}
			}
			if (foundChordFlag === true) {
				state.guitar.chords[i] = j;
			} else {
				j++;
			}
		}
		scaleOffset += scales[state.activeScale][i + state.activeMode]; // Get the church mode in
	}
};

const findSusChords = () => {
	let index = 0;
	for (let i = 0; i < 7; i++) { // Do this for every step
		let k = 0; // Reset the interval indexing
		let foundChordFlag = true; // Assume the chord will pass the test
		state.activeSusChords[i] = 0; // Assume the chord won't be indexed
		while (k < 4 && foundChordFlag === true) {// Test the chord
			if (state.guitar.scale[index + susChord[k]] === 0) foundChordFlag = false; // If the interval falls through, move on
			else k++;
		}
		if (foundChordFlag === true) state.activeSusChords[i] = 1; // If the flag is still up, the chord is there
		index += scales[state.activeScale][i + state.activeMode];
	}
};

const indexAlternateChords = () => {
	let index = 0;
	for (let i = 0; i < 7; i++) { // Do this for every step
		for (let j = 0; j < 10; j++) { // Do this for every chord type
			let k = 0; // Reset the interval indexing
			let foundChordFlag = true; // Assume the chord will pass the test
			state.altChords[i][j] = 0; // Assume the chord won't be indexed
			while(k < 4 && foundChordFlag === true) { // Test the chord
				if (state.guitar.scale[index + chords[j][k]] === 0) foundChordFlag = false; // If the interval falls through, move on
				else k++;
			}
			if(foundChordFlag === true && state.guitar.chords[i] != j) { // Make sure the initial chord is not included
				state.altChords[i][j] = 1; // If the flag is still up, the chord is there
			}
		}
		index += scales[state.activeScale][i + state.activeMode];
	}
};

// This one, together with calculateDiationicScale is the meat of the program
const changeScale = () => {
	state.activeScale = parseInt(key.value);
	state.activeMode = parseInt(mode.value);
	state.guitar.note = parseInt(note.value);

	getNoteNames();
	resetScale();
	loadProperScale();
	findSeventhChords();
	findSusChords();
	indexAlternateChords();
};

const calculateDiatonicScale = limit => {
	var i, j, k, index;
	var offset = 0;

	// First, reset the scale
	for (i = 0; i < state.guitar.fretsPerLine * state.guitar.strings; i++) state.diatonicScale[i] = 0;

	// Next, find the offset
	for (i = 0; i < state.diatonic; i++) offset += scales[state.activeScale][i + state.activeMode]; // Get the church mode in

	// Then, load in the proper chord, converting the interval values to (almost) boolean scale values
	i = 0;
	index = 0;
	do {
		for (j = 0; j < 8; j++) {
			if (limit === SEVENTH)
				state.guitar.relations[index + offset + (j * 12)] = seventhRelations[state.inversion][i-1];
			else
				state.guitar.relations[index + offset + (j * 12)] = triadRelations[state.inversion][i-1];

			if (index - chords[state.guitar.chords[state.diatonic]][state.inversion] === 0)
				state.diatonicScale[index + offset + (j * 12)] = 2; // force the root-note in there
			else
				state.diatonicScale[index + offset + (j * 12)] = 1;
		}
		index = chords[state.guitar.chords[state.diatonic]][i]; // Get the church mode in there
		i++;
	} while(i <= 4 - limit);

	state.diatonicFlag = true; // Only do this when all the calculations have been executed, otherwiste the whole thing might crash.
};

const calculateAlternateScale = limit => {
	let i, j, k, index;
	let offset = 0;

	// First, reset the scale
	for (i = 0; i < state.guitar.fretsPerLine * state.guitar.strings; i++) state.diatonicScale[i] = 0;

	// Next, find the offset
	for (i = 0; i < state.alternate; i++) offset += scales[state.activeScale][i + state.activeMode]; // Get the church mode in

	// Then, load in the proper chord, converting the interval values to (almost) boolean scale values
	i = 0;
	index = 0;
	do {
		for (j = 0; j < 8; j++) {
			state.guitar.relations[index + offset + (j * 12)] = seventhRelations[state.inversion][i-1];
			if(index - chords[state.alternateIndex][state.inversion] === 0)
				state.diatonicScale[index + offset + (j * 12)] = 4; // force the root-note in there
			else
				state.diatonicScale[index + offset + (j * 12)] = 3;
		}
		index = chords[state.alternateIndex][i]; // Get the church mode in there
		i++;
	} while(i <= 4 - limit);

	state.alternateFlag = true; // Only do this when all the calculations have been executed
};

const calculateSusScale = () => {
	let i, j, k, index;
	let offset = 0;

	if (state.activeSusChords[state.diatonic] === 1) { // Only do this if the sus chord is actually in there
		// First, reset the scale
		for(i = 0; i < state.guitar.fretsPerLine * state.guitar.strings; i++) state.diatonicScale[i] = 0;

		// Next, find the offset
		for(i = 0; i < state.diatonic; i++) offset += scales[state.activeScale][i + state.activeMode]; // Get the church mode in

		// If it is, load in the proper chord, converting the interval values to (almost) boolean scale values
		i = 0;
		index = 0;
		do {
			for (j = 0; j < 8; j++) {
				state.guitar.relations[index + offset + (j * 12)] = susRelations[state.inversion][i-1];
				if(index - susChord[state.inversion] === 0)
					state.diatonicScale[index + offset + (j * 12)] = 2; // force the root-note in there
				else
					state.diatonicScale[index + offset + (j * 12)] = 1;
			}
			index = susChord[i]; // Get the church mode in there
			i++;
		} while(i <= 3);

		state.susFlag = true; // Only do this when all the calculations have been executed, otherwise the whole thing might crash.
	}
	else { // Otherwise, block the display
		state.susFlag = false;
	}
};

export {
	changeScale,
	calculateDiatonicScale,
	calculateAlternateScale,
	calculateSusScale
};
