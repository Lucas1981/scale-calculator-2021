/* Event handlers */

key.onchange = changeScale;
note.onchange = changeScale;
mode.onchange = changeScale;
dots.onchange = function() {
	dotsSetting = 0;
	drawGuitar();
}

$(".triadChord").mouseenter(function() {
	alternateFlag = false; // Make the flags mutually exclusive
	inversion = parseInt($('input[name="triadInversions"]:checked').val());
	diatonic = $(".triadChord").index(this);
	calculateDiatonicScale(TRIAD);
});

$(".triadChord").mouseleave(function() {
	diatonicFlag = false;
	drawGuitar();
});

$(".triadChord").click(function() {
	var i = 0;
	var index = 0;

	while(diatonicScale[index] != 2 && index < diatonicScale.length) index++;

	for(i = 0; i < 3; i++)
	{
		while(diatonicScale[index] == 0 && index < diatonicScale.length) index++; // Scan the diatonicScale for each consecutive note
		scheduleSound(index + (12 - guitar.note), i, chordSettings.volume, chordSettings.speed); // Put it in the sequence, with the note offset added
		index++;
	}
});

$(".diatonicChord").mouseenter(function(){
	alternateFlag = false; // Make the flags mutually exclusive
	inversion = parseInt($('input[name="seventhInversions"]:checked').val());
	diatonic = $(".diatonicChord").index(this);
	calculateDiatonicScale(SEVENTH);
});

$(".diatonicChord").mouseleave(() => {
	diatonicFlag = false;
	drawGuitar();
});

$(".diatonicChord").click(() => {
	var index = 0;

	while(diatonicScale[index] != 2) index++;

	for(let i = 0; i < chords[guitar.chords[diatonic]].length; i++) {
		while(diatonicScale[index] == 0) index++; // Scan the diatonicScale for each consecutive note
		scheduleSound(index + (12 - guitar.note), i, chordSettings.volume, chordSettings.speed); // Put it in the sequence, with the note offset added
		index++;
	}
});

$("#playScale").click(() => {
	var index = 0;

	for(let i = 0; i < 8; i++) {
		while(guitar.scale[index] == 0) index++; // Scan the diatonicScale for each consecutive note
		scheduleSound(index + guitar.note, i, 1, 1000); // Put it in the sequence, with the note offset added
		index++;
	}
});

chordStyle.onchange = () => {
	if(chordStyle.value == "0") {
		chordSettings.speed = 0;
		chordSettings.volume = .25;
	} else if (chordStyle.value == "1") {
		chordSettings.speed = 150;
		chordSettings.volume = .25;
	} else {
		chordSettings.speed = 1000;
		chordSettings.volume = 1;
	}
};

$('input[name="displayToggle"]').change(function(){
	printTable();
});

$('input[name="thirdChordsActive"]').change(function(){
	showThirdsFlag = !showThirdsFlag;
	printTable();
});

$('input[name="seventhChordsActive"]').change(function(){
	showSeventhsFlag = !showSeventhsFlag;
	printTable();
});

$('input[name="alternateChordsActive"]').change(function(){
	showAltFlag = !showAltFlag;
	printTable();
});

$('input[name="susChordsActive"]').change(function(){
	showSusFlag = !showSusFlag;
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
