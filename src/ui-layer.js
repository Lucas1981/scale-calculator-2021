import { SEVENTH, pianoJumps, pianoKeys, roman, chords, chordNames, triadChords, triadChordNames } from './consts.js';
import { dots, rings, pianoImage, context, activeSusChords, activeKey, altChords, diatonicScale, state } from './initiation.js';
import { calculateAlternateScale, calculateSusScale } from './scale.js';
import { scheduleSound } from './sound.js';

function printTable() {
	let totalKey = "";
	let totalChords;
	let i, j;

	for (i = 0; i < 7; i++) {
		$(".roman:eq(" + i + ")").html(roman[i]);
		$(".triadChord:eq(" + i + ")").html(activeKey[i] + " " + triadChordNames[triadChords[state.guitar.chords[i]]]);
		$(".diatonicChord:eq(" + i + ")").html(activeKey[i] + " " + chordNames[state.guitar.chords[i]]);
		// Remove the sus class if it's there, then conditionally add it again
		if ($(".susChord:eq(" + i + ")").hasClass("activeSusChord")) {
			$(".susChord:eq(" + i + ")").removeClass("activeSusChord");
		}
		$(".susChord:eq(" + i + ")").html("");

		if(activeSusChords[i] === 1) {
			$(".susChord:eq(" + i + ")").addClass("activeSusChord");
			$(".susChord:eq(" + i + ")").html(activeKey[i] + " sus4");
		}

		totalChords = "";

		for (j = 0; j < chords.length; j++) {
			if (altChords[i][j] === 1)
				totalChords += "<div class=\"altChord\" id=" + i + "-" + j + ">" + activeKey[i] + " " + chordNames[j] + "</div>";
		}
		$(".enharmonicChord:eq(" + i + ")").html(totalChords);

		totalKey += activeKey[i] + " ";
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
	$(".altChord").mouseenter(function(){
		const str = $(this).attr("id");

		state.diatonicFlag = false; // Make the flag mutually exclusive

		if(state.alternateFlag === false) {
			state.inversion = parseInt($('input[name="altInversions"]:checked').val());
			state.alternateIndex = parseInt(str.substr(str.indexOf("-") + 1));
			state.alternate = parseInt($(this).parent(".enharmonicChord").index(".enharmonicChord"));
			calculateAlternateScale(SEVENTH);
		}
	});

	$(".altChord").mouseleave(function() {
		state.alternateFlag = false;
		drawGuitar();
	});

	$(".altChord").click(function() { // Since the altChord index is established somewhere else, this one can stay static
		if (state.alternateFlag === true) { // Only do this when the alternateFlag is up
			let i;
			let index = 0;

			while(diatonicScale[index] !== 4 && index < diatonicScale.length)
				index++;

			for(i = 0; i < chords[state.alternateIndex].length; i++) {
				while(diatonicScale[index] === 0 && index < diatonicScale.length) index++; // Scan the diatonicScale for each consecutive note
				scheduleSound(index + (12 - state.guitar.note), i, state.chordSettings.volume, state.chordSettings.speed); // Put it in the sequence
				index++;
			}
		}
	});

	// Out with the old
	$(".susChord").unbind("mouseenter mouseleave click");

	// In with the new
	$(".activeSusChord").mouseenter(function() {
		state.inversion = parseInt($('input[name="susInversions"]:checked').val());
		state.diatonic = $(".susChord").index(this);
		calculateSusScale();
	});

	$(".activeSusChord").mouseleave(function() {
		state.susFlag = false;
		drawGuitar();
	});

	$(".activeSusChord").click(function() {
		let i = 0;
		let index = 0;

		while (diatonicScale[index] !== 2 && index < diatonicScale.length) index++;

		for (i = 0; i < 3; i++) {
			while(diatonicScale[index] === 0 && index < diatonicScale.length) index++; // Scan the diatonicScale for each consecutive note
			scheduleSound(index + (12 - state.guitar.note), i, state.chordSettings.volume, state.chordSettings.speed); // Put it in the sequence, with the note offset added
			index++;
		}
	});

	drawGuitar();
}

function drawGuitar() {
	let i, j, index;
	let width, height;

	const dotsSetting = parseInt(dots.value);
	const ringsSetting = parseInt(rings.value)

	// You need the display toggle for this
	state.displayToggle = parseInt($('input[name="displayToggle"]:checked').val());

	if (state.displayToggle === 0) {// Guitar display
		// Clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		// First, draw the fretboard
		for (i = 0; i < state.guitar.fretsPerLine; i++) {
			for(j = 0; j < state.guitar.strings; j++) {
				index = state.guitar.fretBoard[i + (j * state.guitar.fretsPerLine)];
				width = state.guitar.fretImages[index].width;
				height = state.guitar.fretImages[index].height;
				context.drawImage(state.guitar.fretImages[index], i * width, j * height);
			}
		}

		// Next, draw the scale
		for(j = 0; j < state.guitar.strings; j++) {
			for(i = 0; i < state.guitar.fretsPerLine; i++) {
				index = state.guitar.scale[state.guitar.tuning[j] + i + state.guitar.note];
				if(index !== 0) {
					index--;
					width = state.guitar.scaleImages[index].width;
					height = state.guitar.scaleImages[index].height;
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
			for (j = 0; j < state.guitar.strings; j++) {
				for (i = 0; i < state.guitar.fretsPerLine; i++) {
					index = diatonicScale[state.guitar.tuning[j] + i + state.guitar.note + 12];
					if (index !== 0) {
						index--;
						width = state.guitar.chordImages[index].width;
						height = state.guitar.chordImages[index].height;
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
	}

	if(state.displayToggle === 1) {// Piano display
		// Clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		// First, draw the piano overlay
		context.drawImage(pianoImage, 0, 0);

		// Next, Run the scale
		for (i = 0; i < 12 * 2; i++) {
			index = state.guitar.scale[i + state.guitar.note + 8];
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
			for (i = 0; i < 12 * 2; i++) {
				index = diatonicScale[i + state.guitar.note + 8];
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
}

export {
	printTable,
	drawGuitar
};
