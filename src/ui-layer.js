import { SEVENTH, pianoJumps, pianoKeys, roman, chords, chordNames, triadChords, triadChordNames } from './consts.js';
import { changeScale, calculateAlternateScale, calculateSusScale } from './scale.js';
import initiateStaticEventHandlers from './event-handlers';
import state from './state.js';
import { scheduleSound } from './sound.js';

const dots = document.getElementById("displayDots");
const rings = document.getElementById("displayRings");
const key = document.getElementById("key");
const note = document.getElementById("note");
const mode = document.getElementById("mode");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const chordStyle = document.getElementById("chordStyle");
canvas.width = 800;
canvas.height = 192;

const handleChange = () => {
	changeScale();
	draw();
};

const initiateEventHandlers = () => {
	key.onchange = handleChange;
	note.onchange = handleChange;
	mode.onchange = handleChange;
	rings.onchange = drawInstrument;
	dots.onchange = drawInstrument;

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

	initiateStaticEventHandlers();
};

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

const printTable = () => {
	let totalKey = "";
	let totalChords;
	let i, j;

	for (i = 0; i < 7; i++) {
		$(".roman:eq(" + i + ")").html(roman[i]);
		$(".triadChord:eq(" + i + ")").html(state.activeKey[i] + " " + triadChordNames[triadChords[state.guitar.chords[i]]]);
		$(".diatonicChord:eq(" + i + ")").html(state.activeKey[i] + " " + chordNames[state.guitar.chords[i]]);
		// Remove the sus class if it's there, then conditionally add it again
		if ($(".susChord:eq(" + i + ")").hasClass("activeSusChord")) {
			$(".susChord:eq(" + i + ")").removeClass("activeSusChord");
		}
		$(".susChord:eq(" + i + ")").html("");

		if(state.activeSusChords[i] === 1) {
			$(".susChord:eq(" + i + ")").addClass("activeSusChord");
			$(".susChord:eq(" + i + ")").html(state.activeKey[i] + " sus4");
		}

		totalChords = "";

		for (j = 0; j < chords.length; j++) {
			if (state.altChords[i][j] === 1)
				totalChords += "<div class=\"altChord\" id=" + i + "-" + j + ">" + state.activeKey[i] + " " + chordNames[j] + "</div>";
		}
		$(".enharmonicChord:eq(" + i + ")").html(totalChords);

		totalKey += state.activeKey[i] + " ";
	}
	$("#scale").empty();
	$("#scale").html(totalKey);

	// Check the table display status
	if (state.showThirdsFlag === true) {
		$(".triadChord").show();
		$("#triadHeader").show();
	}
	if (state.showThirdsFlag === false) {
		$(".triadChord").hide();
		$("#triadHeader").hide();
	}
	if (state.showSeventhsFlag === true) {
		$(".diatonicChord").show();
		$("#seventhHeader").show();
	}
	if (state.showSeventhsFlag === false) {
		$(".diatonicChord").hide();
		$("#seventhHeader").hide();
	}
	if (state.showAltFlag === true) {
		$(".enharmonicChord").show();
		$("#altHeader").show();
	}
	if (state.showAltFlag === false) {
		$(".enharmonicChord").hide();
		$("#altHeader").hide();
	}
	if (state.showSusFlag === true) {
		$(".susChord").show();
		$("#susHeader").show();
	}
	if (state.showSusFlag === false) {
		$(".susChord").hide();
		$("#susHeader").hide();
	}

	// Event handlers have to be reset in real time. Ugly? Yes. But I can't get it to work if I wrap it in a function.

	// Out with the old
	$(".altChord").unbind("mouseenter mouseleave click");

	// In with the new
	$(".altChord").mouseenter(function() { // We need the 'this', so we write it as a scoped function
		const str = $(this).attr("id");

		state.diatonicFlag = false; // Make the flag mutually exclusive

		if (state.alternateFlag === false) {
			state.inversion = parseInt($('input[name="altInversions"]:checked').val());
			state.alternateIndex = parseInt(str.substr(str.indexOf("-") + 1));
			state.alternate = parseInt($(this).parent(".enharmonicChord").index(".enharmonicChord"));
			calculateAlternateScale(SEVENTH);
			drawInstrument();
		}
	});

	$(".altChord").mouseleave(() => {
		state.alternateFlag = false;
		drawInstrument();
	});

	$(".altChord").click(() => { // Since the altChord index is established somewhere else, this one can stay static
		if (state.alternateFlag === true) { // Only do this when the alternateFlag is up
			let i;
			let index = 0;

			while(state.diatonicScale[index] !== 4 && index < state.diatonicScale.length)
				index++;

			for(i = 0; i < chords[state.alternateIndex].length; i++) {
				while(state.diatonicScale[index] === 0 && index < state.diatonicScale.length) index++; // Scan the state.diatonicScale for each consecutive note
				scheduleSound(index + (12 - state.guitar.note), i, state.chordSettings.volume, state.chordSettings.speed); // Put it in the sequence
				index++;
			}
		}
	});

	// Out with the old
	$(".susChord").unbind("mouseenter mouseleave click");

	// In with the new
	$(".activeSusChord").mouseenter(function() { // We need the 'this' object, so we use a scoped function
		state.inversion = parseInt($('input[name="susInversions"]:checked').val());
		state.diatonic = $(".susChord").index(this);
		calculateSusScale();
		drawInstrument();
	});

	$(".activeSusChord").mouseleave(() => {
		state.susFlag = false;
		drawInstrument();
	});

	$(".activeSusChord").click(() => {
		let i = 0;
		let index = 0;

		while (state.diatonicScale[index] !== 2 && index < state.diatonicScale.length) index++;

		for (i = 0; i < 3; i++) {
			while(state.diatonicScale[index] === 0 && index < state.diatonicScale.length) index++; // Scan the state.diatonicScale for each consecutive note
			scheduleSound(index + (12 - state.guitar.note), i, state.chordSettings.volume, state.chordSettings.speed); // Put it in the sequence, with the note offset added
			index++;
		}
	});
};

const drawGuitar = (dotsSetting, ringsSetting) => {
	context.clearRect(0, 0, canvas.width, canvas.height);

	// First, draw the fretboard
	for (let i = 0; i < state.guitar.fretsPerLine; i++) {
		for (let j = 0; j < state.guitar.strings; j++) {
			const index = state.guitar.fretBoard[i + (j * state.guitar.fretsPerLine)];
			const width = state.guitar.fretImages[index].width;
			const height = state.guitar.fretImages[index].height;
			context.drawImage(state.guitar.fretImages[index], i * width, j * height);
		}
	}

	// Next, draw the scale
	for (let j = 0; j < state.guitar.strings; j++) {
		for (let i = 0; i < state.guitar.fretsPerLine; i++) {
			let index = state.guitar.scale[state.guitar.tuning[j] + i + state.guitar.note];
			if (index !== 0) {
				index--;
				const width = state.guitar.scaleImages[index].width;
				const height = state.guitar.scaleImages[index].height;
				context.drawImage(state.guitar.scaleImages[index], i * width, j * height);

				context.save();
				context.fillStyle = "white";
				context.textAlign = "center";
				context.textBaseline = "middle";
				context.font = "10px helvetica";
				if (dotsSetting === 1)
					context.fillText(state.guitar.noteNames[i + state.guitar.tuning[j] + state.guitar.note], 16 + (i * width), 16 + (j * height));
				if (dotsSetting === 2)
					context.fillText(state.guitar.romanNames[i + state.guitar.tuning[j] + state.guitar.note], 16 + (i * width), 16 + (j * height));
				context.restore();
			}
		}
	}

	// If the diatonic flag is up, display the proper diatonic chord
	if (state.diatonicFlag === true || state.alternateFlag === true || state.susFlag === true) {
		for (let j = 0; j < state.guitar.strings; j++) {
			for (let i = 0; i < state.guitar.fretsPerLine; i++) {
				let index = state.diatonicScale[state.guitar.tuning[j] + i + state.guitar.note + 12];
				if (index !== 0) {
					index--;
					const width = state.guitar.chordImages[index].width;
					const height = state.guitar.chordImages[index].height;
					context.drawImage(state.guitar.chordImages[index], i * width, j * height);

					if (ringsSetting === 1) {
						context.save();
						context.fillStyle = "black";
						context.textAlign = "center";
						context.textBaseline = "middle";
						context.font = "10px helvetica";
						context.fillText(state.guitar.relations[i + state.guitar.tuning[j] + state.guitar.note], 16 + (i * width), 28 + (j * height));
						context.restore();
					}
				}
			}
		}
	}
};

const drawPiano = (dotsSetting, ringsSetting) => {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(state.pianoImage, 0, 0);

	// Run the scale
	for (let i = 0; i < 12 * 2; i++) {
		let index = state.guitar.scale[i + state.guitar.note + 8];
		if (index !== 0) {
			index--;
			context.drawImage(state.guitar.scaleImages[index], 11 + (pianoJumps[i] * 27), (pianoKeys[i] * 100) + 50);
			context.save();
			context.fillStyle = "white";
			context.textAlign = "center";
			context.textBaseline = "middle";
			context.font = "12px helvetica";
			if (dotsSetting === 1)
				context.fillText(state.guitar.noteNames[i + state.guitar.note + 8], 27 + (pianoJumps[i] * 27), (pianoKeys[i] * 100) + 66);
			if (dotsSetting === 2)
				context.fillText(state.guitar.romanNames[i + state.guitar.note + 8], 27 + (pianoJumps[i] * 27), (pianoKeys[i] * 100) + 66);
			context.restore();
		}
	}

	// If the diatonic flag is up, show the chord
	if (state.diatonicFlag === true || state.susFlag === true || state.alternateFlag === true) {
		for (let i = 0; i < 12 * 2; i++) {
			let index = state.diatonicScale[i + state.guitar.note + 8];
			if (index !== 0) {
				index--;
				context.drawImage(state.guitar.chordImages[index], 11+ (pianoJumps[i] * 27), (pianoKeys[i] * 100) + 50);
				if (ringsSetting === 1) {
					context.save();
					context.fillStyle = "black";
					context.textAlign = "center";
					context.textBaseline = "middle";
					context.font = "10px helvetica";
					context.fillText(state.guitar.relations[i + state.guitar.note + 8], 27 + (pianoJumps[i] * 27), (pianoKeys[i] * 100) + 78);
					context.restore();
				}
			}
		}
	}
}

const drawInstrument = () => {
	const dotsSetting = parseInt(dots.value);
	const ringsSetting = parseInt(rings.value)

	// You need the display toggle for this
	state.displayToggle = parseInt($('input[name="displayToggle"]:checked').val());
	switch(state.displayToggle) {
		case 0:
			drawGuitar(dotsSetting, ringsSetting);
			break;
		case 1:
			drawPiano(dotsSetting, ringsSetting);
			break;
		default:
			throw new Error('Illegale instrument index');
	}
};

const draw = () => {
	printTable();
	drawInstrument();
}

const exposeUserInterface = () => {
	changeScale();
	$(".option").show();
	$("#tableControls").show();
	$("#note").focus();
	draw();
};

export {
	initiateEventHandlers,
	draw,
	printTable,
	drawInstrument,
	renderLoadingScreen,
	exposeUserInterface
};
