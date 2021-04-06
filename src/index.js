import { TRIAD, SEVENTH, chords } from './consts.js';
import { changeScale, calculateDiatonicScale } from './scale.js';
import { printTable, drawGuitar } from './ui-layer.js';
import { scheduleSound, initiateSounds } from './sound.js';
import {
	key,
	note,
	mode,
	dots,
	initiateVariables,
	initiateChordSettings,
	initiateGuitar,
	initiateImages,
	diatonicScale,
	context,
	state
} from './initiation.js';

/* Event handlers */

key.onchange = changeScale;
note.onchange = changeScale;
mode.onchange = changeScale;
dots.onchange = function() {
	state.dotsSetting = 0;
	drawGuitar();
}

$(".triadChord").mouseenter(function() {
	state.alternateFlag = false; // Make the flags mutually exclusive
	state.inversion = parseInt($('input[name="triadInversions"]:checked').val());
	state.diatonic = $(".triadChord").index(this);
	calculateDiatonicScale(TRIAD);
});

$(".triadChord").mouseleave(function() {
	state.diatonicFlag = false;
	drawGuitar();
});

$(".triadChord").click(function() {
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

$(".diatonicChord").mouseenter(function(){
	state.alternateFlag = false; // Make the flags mutually exclusive
	state.inversion = parseInt($('input[name="seventhInversions"]:checked').val());
	state.diatonic = $(".diatonicChord").index(this);
	calculateDiatonicScale(SEVENTH);
});

$(".diatonicChord").mouseleave(() => {
	state.diatonicFlag = false;
	drawGuitar();
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

$('input[name="displayToggle"]').change(function(){
	printTable();
});

$('input[name="thirdChordsActive"]').change(function(){
	state.showThirdsFlag = !state.showThirdsFlag;
	printTable();
});

$('input[name="seventhChordsActive"]').change(function(){
	state.showSeventhsFlag = !state.showSeventhsFlag;
	printTable();
});

$('input[name="alternateChordsActive"]').change(function(){
	state.showAltFlag = !state.showAltFlag;
	printTable();
});

$('input[name="susChordsActive"]').change(function(){
	state.showSusFlag = !state.showSusFlag;
	printTable();
});

const renderLoadingScreen = () => {
  return setInterval(() => {
    context.save();
    context.fillStyle = "#cccccc";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "26px helvetica";
    context.fillText("Loading images and sounds...", 960/2, canvas.height/2);
    context.restore();
  }, 16);
};

$(document).ready(function() {
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
  	changeScale();
  	$(".option").show();
  	$("#tableControls").show();
  	$("#note").focus();
  	printTable();
  });
});
