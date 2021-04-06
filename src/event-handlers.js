import { TRIAD, SEVENTH, chords } from './consts.js';
import { diatonicScale } from './initiation.js';
import { calculateDiatonicScale } from './scale.js';
import { printTable, drawInstrument } from './ui-layer.js';
import state from './state.js';
import { scheduleSound } from './sound.js';

const setEventHandlers = () => {
  $(".triadChord").mouseenter(function() {
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
  	let index = 0;

  	while (diatonicScale[index] !== 2 && index < diatonicScale.length) index++;

  	for (let i = 0; i < 3; i++)
  	{
  		while (diatonicScale[index] === 0 && index < diatonicScale.length) index++; // Scan the diatonicScale for each consecutive note
  		scheduleSound(index + (12 - state.guitar.note), i, state.chordSettings.volume, state.chordSettings.speed); // Put it in the sequence, with the note offset added
  		index++;
  	}
  });

  $(".diatonicChord").mouseenter(function() {
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
  	let index = 0;

  	while (diatonicScale[index] !== 2) index++;

  	for (let i = 0; i < chords[state.guitar.chords[state.diatonic]].length; i++) {
  		while(diatonicScale[index] === 0) index++; // Scan the diatonicScale for each consecutive note
  		scheduleSound(index + (12 - state.guitar.note), i, state.chordSettings.volume, state.chordSettings.speed); // Put it in the sequence, with the note offset added
  		index++;
  	}
  });

  $("#playScale").click(() => {
  	let index = 0;

  	for (let i = 0; i < 8; i++) {
  		while (state.guitar.scale[index] === 0) index++; // Scan the diatonicScale for each consecutive note
  		scheduleSound(index + state.guitar.note, i, 1, 1000); // Put it in the sequence, with the note offset added
  		index++;
  	}
  });

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
};

export default setEventHandlers;
