import { TRIAD, SEVENTH, chords } from './consts.js';
import {
	initiateVariables,
	initiateChordSettings,
	initiateGuitar,
	initiateImages,
	diatonicScale,
	state
} from './initiation.js';
import { calculateDiatonicScale } from './scale.js';
import { printTable, drawInstrument, renderLoadingScreen, exposeUserInterface, setEventHandlers } from './ui-layer.js';
import { scheduleSound, initiateSounds } from './sound.js';

/* Event handlers */

setEventHandlers();

$(".triadChord").mouseenter(() => {
	state.alternateFlag = false; // Make the flags mutually exclusive
	state.inversion = parseInt($('input[name="triadInversions"]:checked').val());
	state.diatonic = $(".triadChord").index(this);
	calculateDiatonicScale(TRIAD);
});

$(".triadChord").mouseleave(() => {
	state.diatonicFlag = false;
	drawInstrument();
});

$(".triadChord").click(() => {
	var i = 0;
	var index = 0;

	while (diatonicScale[index] !== 2 && index < diatonicScale.length) index++;

	for(i = 0; i < 3; i++)
	{
		while(diatonicScale[index] === 0 && index < diatonicScale.length) index++; // Scan the diatonicScale for each consecutive note
		scheduleSound(index + (12 - state.guitar.note), i, state.chordSettings.volume, state.chordSettings.speed); // Put it in the sequence, with the note offset added
		index++;
	}
});

$(".diatonicChord").mouseenter(() => {
	state.alternateFlag = false; // Make the flags mutually exclusive
	state.inversion = parseInt($('input[name="seventhInversions"]:checked').val());
	state.diatonic = $(".diatonicChord").index(this);
	calculateDiatonicScale(SEVENTH);
});

$(".diatonicChord").mouseleave(() => {
	state.diatonicFlag = false;
	drawInstrument();
});

$(".diatonicChord").click(() => {
	var index = 0;

	while (diatonicScale[index] !== 2) index++;

	for (let i = 0; i < chords[state.guitar.chords[state.diatonic]].length; i++) {
		while(diatonicScale[index] === 0) index++; // Scan the diatonicScale for each consecutive note
		scheduleSound(index + (12 - state.guitar.note), i, state.chordSettings.volume, state.chordSettings.speed); // Put it in the sequence, with the note offset added
		index++;
	}
});

$("#playScale").click(() => {
	var index = 0;

	for(let i = 0; i < 8; i++) {
		while (state.guitar.scale[index] === 0) index++; // Scan the diatonicScale for each consecutive note
		scheduleSound(index + state.guitar.note, i, 1, 1000); // Put it in the sequence, with the note offset added
		index++;
	}
});

chordStyle.onchange = () => {
	if (chordStyle.value === "0") {
		state.chordSettings.speed = 0;
		state.chordSettings.volume = .25;
	} else if (chordStyle.value === "1") {
		state.chordSettings.speed = 150;
		state.chordSettings.volume = .25;
	} else {
		state.chordSettings.speed = 1000;
		state.chordSettings.volume = 1;
	}
};

$('input[name="displayToggle"]').change(() => {
	printTable();
});

$('input[name="thirdChordsActive"]').change(() => {
	state.showThirdsFlag = !state.showThirdsFlag;
	printTable();
});

$('input[name="seventhChordsActive"]').change(() => {
	state.showSeventhsFlag = !state.showSeventhsFlag;
	printTable();
});

$('input[name="alternateChordsActive"]').change(() => {
	state.showAltFlag = !state.showAltFlag;
	printTable();
});

$('input[name="susChordsActive"]').change(() => {
	state.showSusFlag = !state.showSusFlag;
	printTable();
});

$(document).ready(() => {
  const promises = [];
	const marginFix = document.getElementsByClassName("container")[0].getBoundingClientRect();

	// Once everything is up, fix the automatically generated margin to prevent jumps when the scrollbar comes into play
	$(".container").css("margin-left", marginFix.left + "px"); // Put it back in as an absolute value

  const interval = renderLoadingScreen();

	initiateVariables();
  initiateChordSettings();
	initiateGuitar();
	promises.push(...initiateImages());
  promises.push(...initiateSounds());

  Promise.all(promises).then(() => {
    clearInterval(interval);
    exposeUserInterface();
  });
});
