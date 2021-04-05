/* Variables */

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var key = document.getElementById("key");
var note = document.getElementById("note");
var mode = document.getElementById("mode");
var chordStyle = document.getElementById("chordStyle");
var mySound = new Array();
var inversion;
var activeKey = new Array();
var displayToggle;
var pianoImage = new Image();
var altChords = new Array();
var showThirdsFlag, showSeventhsFlag, showAltFlag;
var changeFlag;
var audioExtension;
var imageCounter, totalImages;
var audioCounter, totalAudio;
var soundChannels = new Array();

var TRIAD = 1;
var SEVENTH = 0;
var ALTERNATIVE = 0;
var REGULAR = 1;

// Piano key jump units
var pianoJumps = [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26];
var pianoKeys = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];

// Key name index
keys = [	["A", "B", "C", "D", "E", "F", "G",
			 "A", "B", "C", "D", "E", "F", "G",
			 "A", "B", "C", "D", "E", "F", "G"],
			[2, 1, 2, 2, 1, 2, 2,
			 2, 1, 2, 2, 1, 2, 2,
             2, 1, 2, 2, 1, 2, 2] ];

// The scales are here duplicated so the modes can reach
var scales = [  [2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1], // major
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
				
var chords = [  [0, 3, 7, 10], // minor 7th
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
				
var susChords = [   [0, 2, 7], // Sus2 chord
					[0, 5, 7] ]; // Sus4 chord
				
var chordNames = [	"Minor 7th", 
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
					
var triadChords = [0, 1, 1, 2, 0, 2, 3, 3, 4, 2, 5, 0, 5]; // We can use the seventh chord as an index for this
					
var triadChordNames = [ "Minor",
					"Major",
					"Diminished",
					"Augmented",
					"Major diminished",
					"Diminished sus2" ];
					
var roman = ["I", "II", "III", "IV", "V", "VI", "VII"];
		
var activeScale;
var activeMode;
var diationicFlag;
var diatonic;
var diatonicScale = new Array();
var alternateIndex;
var alternateFlag;
var alternate;


/* Classes */

function GuitarType()
{
	this.fretBoard = new Array();
	this.scale = new Array();
	this.chords = new Array();
	this.tuning = new Array();	
	this.fretsPerLine;
	this.strings;
	this.fretImageNames = new Array();
	this.fretImages = new Array();
	this.scaleImageNames = new Array();
	this.scaleImages = new Array();
	this.chordImageNames = new Array();
	this.chordImages = new Array();
	this.note;
}

function ChordSettingsType()
{
	this.volume;
	this.speed;
}

/* Instantiate the classes */

var guitar = new GuitarType();
var chordSettings = new ChordSettingsType();

/* Functions */

function initiateVariables()
{
	var i, j;
	var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); // Detect IE
	
	for(i = 0; i < chords.length; i++)
	{
		altChords[i] = new Array();
		for(j = 0; j < chords.length; j++) altChords[i][j] = 0;
	}
		
	showThirdsFlag = true;
	showSeventhsFlag = true;
	showAltFlag = false;
	diatonicFlag = false;
	alternateFlag = false;
	
	canvas.width = 800;
	canvas.height = 192;
	
	guitar.fretsPerLine = 25; // 24 + the open position
	guitar.strings = 6;
	
	chordSettings.volume = .25;
	chordSettings.speed = 150;
	
	imageCounter = 0;
	totalImages = 0;
	audioCounter = 0;
	totalAudio = 0;
	
	guitar.fretBoard = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
						0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
						0, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1,
						0, 1, 1, 3, 1, 3, 1, 3, 1, 3, 1, 1, 1, 1, 1, 3, 1, 3, 1, 3, 1, 3, 1, 1, 1,
						0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
						0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3];
	
	guitar.tuning = [0, 7, 3, 10, 5, 0];

	guitar.fretImageNames = ["open-fret.png", "fret.png", "fret-met-stip-onder.png", "fret-met-stip-boven.png"];
	for(i = 0; i < guitar.fretImageNames.length; i++)
	{
		totalImages++;
		guitar.fretImages[i] = new Image();
		guitar.fretImages[i].src = "images/" + guitar.fretImageNames[i];
		guitar.fretImages[i].onload = function(){imageCounter++;}
	}
	
	guitar.scaleImageNames = ["blue-dot.png", "red-dot.png"];
	for(i = 0; i < guitar.scaleImageNames.length; i++)
	{
		totalImages++;
		guitar.scaleImages[i] = new Image();
		guitar.scaleImages[i].src = "images/" + guitar.scaleImageNames[i];
		guitar.scaleImages[i].onload = function(){imageCounter++;}
	}
	
	guitar.chordImageNames = ["yellow-hoop.png", "orange-hoop.png", "green-hoop.png", "dark-green-hoop.png"];
	for(i = 0; i < guitar.chordImageNames.length; i++)
	{
		totalImages++;
		guitar.chordImages[i] = new Image();
		guitar.chordImages[i].src = "images/" + guitar.chordImageNames[i];
		guitar.chordImages[i].onload = function(){imageCounter++;}
	}
	
	totalImages++;
	pianoImage.src = "images/piano.png";
	pianoImage.onload = function(){imageCounter++;}
	
	for(i = 0; i < 48; i++)
	{
		totalAudio++;
		mySound[i] = new Audio();
		if("" != mySound[i].canPlayType("audio/mp3"))
			mySound[i].src = "audio/" + i.toString() + ".mp3"; // IE only supports mp3
		else
			mySound[i].src = "audio/" + i.toString() + ".wav";
		
		mySound[i].preload = 'auto';
		mySound[i].load();
		mySound[i].onloadeddata = function(){
			console.log("Audio file " + audioCounter + " loaded");
			audioCounter++;
		}
	}
	
	for(i = 0; i < 32; i++) // 32 channels should be enough really.
	{
		var tempAudio = new Audio();
		soundChannels.push(tempAudio);
	}
}

function changeScale() // This one, together with calculateDiationicScale is the meat of the program
{
	var i, j, k, index;
	var foundChordFlag;
	var scaleOffset;
	var keyIncrease = 0;
    var scaleIncrease = 0;
    var flatCorrection = 0;
    var sharpCorrection = 0;
	
	changeFlag = true;
	
	activeScale = parseInt(key.value);
	activeMode = parseInt(mode.value);
	guitar.note = parseInt(note.value);
	
	// Get the proper names of the notes in the key
	activeKey[0] = $("#note option:eq(" + $("#note")[0].selectedIndex + ")").attr("name");
	i=7;
    
    while(keys[0][i] != activeKey[0].substring(0,1)) i++;
    if(activeKey[0].length > 1)
  	{
    	if(activeKey[0].substring(1,2) == "#") sharpCorrection = 1;
        if(activeKey[0].substring(1,2) == "b") flatCorrection = 1;
    }
            
    for(j=0;j<7;j++)
    {
        activeKey[j+1] = keys[0][1+i+j];
        
        keyIncrease += keys[1][j+i];
        scaleIncrease += scales[activeScale][j];
          
    	if(keyIncrease - sharpCorrection + flatCorrection > scaleIncrease)
        {
        	for(k=0; k < ((keyIncrease - sharpCorrection + flatCorrection) - scaleIncrease); k++)
            {
            	activeKey[j+1] += "b";
            }
        }
    	if(keyIncrease - sharpCorrection + flatCorrection < scaleIncrease)
        {
        	for(k=0;k< (scaleIncrease - (keyIncrease - sharpCorrection + flatCorrection)); k++)
            {
            	activeKey[j+1] += "#";
            }
        }
    }
	
	// First, reset the scale
	for(i = 0; i < guitar.fretsPerLine * guitar.strings; i++) guitar.scale[i] = 0;
	
	// Next, load in the proper scale, converting the interval values to (almost) boolean scale values	
	i = 0;
	index = 0;
	do
	{
		for(j = 0; j < 4; j++)
		{
			if(index > 0)
				guitar.scale[index + (j * 12)] = 1;
			else
				guitar.scale[index + (j * 12)] = 2; // Force the root-note in there
		}
		index += scales[activeScale][i + activeMode]; // Get the church mode in there
		i++;
	} while(i < 7);
	
	// Then, find all the seventh chords in the scale and load the index in the guitar.chords array
	scaleOffset = 0;
	for(i = 0; i < 7; i++) // For each step in the scale
	{
		foundChordFlag = false;
		j = 0;
		while(foundChordFlag == false && j < chords.length) // Check each possible chord
		{
			index = 0;
			foundChordFlag = true; // Innocent until proven guilty
			for(k = 0; foundChordFlag == true && k < 4; k++) // Check all intervals in the chord
			{
				index = chords[j][k]; // Step to the next chord jump
				if(guitar.scale[scaleOffset + index] == 0)
				{
					foundChordFlag = false;
				}
			}
			if(foundChordFlag == true)
			{
				guitar.chords[i] = j;
			}
			else
			{
				j++;
			}
		}
		scaleOffset += scales[activeScale][i + activeMode]; // Get the church mode in
	}
	
	// Finally, index all the alternate chords
	index = 0;
	for(i = 0; i < 7; i++) // Do this for every step
	{
		for(j = 0; j < 10; j++) // Do this for every chord type
		{			
			k = 0; // Reset the interval indexing
			foundChordFlag = true; // Assume the chord will pass the test
			altChords[i][j] = 0; // Assume the chord won't be indexed
			while(k < 4 && foundChordFlag == true) // Test the chord
			{
				if(guitar.scale[index + chords[j][k]] == 0) foundChordFlag = false; // If the interval falls through, move on
				else k++;
			}
			if(foundChordFlag == true && guitar.chords[i] != j) // Make sure the initial chord is not included 
				altChords[i][j] = 1; // If the flag is still up, the chord is there
		}
		index += scales[activeScale][i];
	}
	
	drawGuitar();

}

function calculateDiatonicScale(limit)
{
	var i, j, k, index;
	var offset = 0;

	// First, reset the scale
	for(i = 0; i < guitar.fretsPerLine * guitar.strings; i++) diatonicScale[i] = 0;
	
	// Next, find the offset
	for(i = 0; i < diatonic; i++) offset += scales[activeScale][i + activeMode]; // Get the church mode in
	
	// Then, load in the proper chord, converting the interval values to (almost) boolean scale values	
	i = 0;
	index = 0;
	do
	{
		for(j = 0; j < 8; j++)
		{
			if(index - chords[guitar.chords[diatonic]][inversion] == 0)
				diatonicScale[index + offset + (j * 12)] = 2; // force the root-note in there
			else
				diatonicScale[index + offset + (j * 12)] = 1;
		}
		index = chords[guitar.chords[diatonic]][i]; // Get the church mode in there
		i++;
	} while(i <= 4 - limit);
	
	diatonicFlag = true; // Only do this when all the calculations have been executed, otherwiste the whole thing might crash.

	drawGuitar();
}

function calculateAlternateScale(limit)
{
	var i, j, k, index;
	var offset = 0;

	// First, reset the scale
	for(i = 0; i < guitar.fretsPerLine * guitar.strings; i++) diatonicScale[i] = 0;
	
	// Next, find the offset
	for(i = 0; i < alternate; i++) offset += scales[activeScale][i + activeMode]; // Get the church mode in
	
	// Then, load in the proper chord, converting the interval values to (almost) boolean scale values	
	i = 0;
	index = 0;
	do
	{
		for(j = 0; j < 8; j++)
		{
			if(index - chords[alternateIndex][inversion] == 0)
				diatonicScale[index + offset + (j * 12)] = 4; // force the root-note in there
			else
				diatonicScale[index + offset + (j * 12)] = 3;
		}
		index = chords[alternateIndex][i]; // Get the church mode in there
		i++;
	} while(i <= 4 - limit);
	
	alternateFlag = true; // Only do this when all the calculations have been executed
	
	drawGuitar();
}

function printTable()
{
	var totalKey = "";
	var totalChords;
	var i, j;
		
	for(i = 0; i < 7; i++)
	{
		$(".roman:eq(" + i + ")").html(roman[i]);
		$(".triadChord:eq(" + i + ")").html(activeKey[i] + " " + triadChordNames[triadChords[guitar.chords[i]]]);
		$(".diatonicChord:eq(" + i + ")").html(activeKey[i] + " " + chordNames[guitar.chords[i]]);
		//$(".enharmonicChord").css("display", "none");
		
		totalChords = "";
		
		for(j = 0; j < chords.length; j++)
		{
			if(altChords[i][j] == 1)
				totalChords += "<div class=\"altChord\" id=" + i + "-" + j + ">" + activeKey[i] + " " + chordNames[j] + "</div>";				
		}
		$(".enharmonicChord:eq(" + i + ")").html(totalChords);
		
		totalKey += activeKey[i] + " ";
	}
	$("#scale").html(totalKey);
	
	// Event handlers have to be reset in real time. Ugly? Yes. But I can't get it to work if I wrap it in a function.
	if(changeFlag == true)
	{
		changeFlag = false;
		$(".altChord").mouseenter(function(){
		
			var str = $(this).attr("id");
			
			diatonicFlag = false; // Make the flag mutually exclusive
							
			if(alternateFlag == false)
			{
				inversion = parseInt($('input[name="altInversions"]:checked').val());
				alternateIndex = parseInt(str.substr(str.indexOf("-") + 1));
				alternate = parseInt($(this).parent(".enharmonicChord").index(".enharmonicChord"));
				calculateAlternateScale(SEVENTH);
			}
		});
		
		$(".altChord").mouseleave(function(){
			alternateFlag = false;
			drawGuitar();	
		});
	}
	
	// Check the table display status
	if(showThirdsFlag == true)
	{
		$(".triadChord").show();
		$("#triadHeader").show();
	}
	if(showThirdsFlag == false)
	{
		$(".triadChord").hide();
		$("#triadHeader").hide();
	}
	
	if(showSeventhsFlag == true)
	{
		$(".diatonicChord").show();
		$("#seventhHeader").show();
	}
	if(showSeventhsFlag == false)
	{
		$(".diatonicChord").hide();
		$("#seventhHeader").hide();
	}
	
	if(showAltFlag == true)
	{
		$(".enharmonicChord").show();
		$("#altHeader").show();
	}
	if(showAltFlag == false)
	{
		$(".enharmonicChord").hide();
		$("#altHeader").hide();
	}
}

function drawGuitar()
{
	var i, j, index;
	var width, height;
	
	// You need the display toggle for this
	displayToggle = parseInt($('input[name="displayToggle"]:checked').val());

	if(displayToggle == 0) // Guitar display
	{
		// Clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		// First, draw the fretboard	
		for(i = 0; i < guitar.fretsPerLine; i++)
		{
			for(j = 0; j < guitar.strings; j++)
			{
				index = guitar.fretBoard[i + (j * guitar.fretsPerLine)];
				width = guitar.fretImages[index].width;
				height = guitar.fretImages[index].height;
				context.drawImage(guitar.fretImages[index], i * width, j * height);
			}
		}
		
		// Next, draw the scale	
		for(j = 0; j < guitar.strings; j++)
		{
			for(i = 0; i < guitar.fretsPerLine; i++)
			{
				index = guitar.scale[guitar.tuning[j] + i + guitar.note];
				if(index != 0)
				{
					index--;
					width = guitar.scaleImages[index].width;
					height = guitar.scaleImages[index].height;
					context.drawImage(guitar.scaleImages[index], i * width, j * height);
				}
			}
		}
		
		// If the diatonic flag is up, display the proper diatonic chord
		if(diatonicFlag == true || alternateFlag == true)
		{
			for(j = 0; j < guitar.strings; j++)
			{
				for(i = 0; i < guitar.fretsPerLine; i++)
				{
					index = diatonicScale[guitar.tuning[j] + i + guitar.note + 12];
					if(index != 0)
					{
						index--;
						width = guitar.chordImages[index].width;
						height = guitar.chordImages[index].height;
						context.drawImage(guitar.chordImages[index], i * width, j * height);
					}
				}
			}
		}
	}
	
	if(displayToggle == 1) // Piano display
	{
		// Clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		// First, draw the piano overlay
		context.drawImage(pianoImage, 0, 0);
		
		// Next, Run the scale
		for(i = 0; i < 12 * 2; i++)
		{
			index = guitar.scale[i + guitar.note + 8];
			if(index != 0)
			{
				index--;
				context.drawImage(guitar.scaleImages[index], 11 + (pianoJumps[i] * 27), (pianoKeys[i] * 100) + 50);
			}
		}
		
		// If the diatonic flag is up, show the chord
		if(diatonicFlag == true)
		{
			for(i = 0; i < 12 * 2; i++)
			{
				index = diatonicScale[i + guitar.note + 8];
				if(index != 0)
				{
					index--;
					context.drawImage(guitar.chordImages[index], 11+ (pianoJumps[i] * 27), (pianoKeys[i] * 100) + 50);
				}
			}
		}
	}
	
	printTable();

}

function getAvailableSoundChannel(){
	var tempAudio;
	var i;
	
	for(i = 0; i < 32; i++)
	{
		tempAudio = soundChannels[i];
		
		if(tempAudio.played && tempAudio.played.length > 0)
		{
			if(tempAudio.ended)
				return tempAudio;
		}
		else
		{
			if(!tempAudio.ended)
				return tempAudio;
		}
	}
	
	return undefined;
	
}

function scheduleSound(index, timeStretch, volume, speed)
{
	var soundClone; // This cloning business is to keep the browser (Firefox actually) from choking on a sound

	setTimeout(function(){
		var endTime = new Date();
		var track = getAvailableSoundChannel();
		if(track != undefined)
		{
			track.src = mySound[index].src;
			track.load();
			track.volume = volume;
			track.play();
		}
		var endTime = new Date();
	}, speed * timeStretch);
}
	
/* Event handlers */

key.onchange = function(){
	changeScale();
}

note.onchange = function()
{
	changeScale();
}

mode.onchange = function()
{
	changeScale();
}

$(".triadChord").mouseenter(function(){	
	alternateFlag = false; // Make the flags mutually exclusive
	inversion = parseInt($('input[name="triadInversions"]:checked').val());
	diatonic = $(".triadChord").index(this);
	calculateDiatonicScale(TRIAD);
});

$(".triadChord").mouseleave(function(){
	diatonicFlag = false;
	drawGuitar();
});

$(".triadChord").click(function(){
	var i = 0;
	var index = 0;
	var soundClone;
	
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

$(".diatonicChord").mouseleave(function(){
	diatonicFlag = false;
	drawGuitar();
});

$(".diatonicChord").click(function(){
	var i;
	var index = 0;
	var soundClone;
	
	while(diatonicScale[index] != 2) index++;
	
	for(i = 0; i < chords[guitar.chords[diatonic]].length; i++)
	{
		while(diatonicScale[index] == 0) index++; // Scan the diatonicScale for each consecutive note
		scheduleSound(index + (12 - guitar.note), i, chordSettings.volume, chordSettings.speed); // Put it in the sequence, with the note offset added
		index++;
	}
});

$(".enharmonicChord").click(function(e){ // Since the altChord index is established somewhere else, this one can stay static
	
	if(alternateFlag == true) // Only do this when the alternateFlag is up
	{
		var i;
		var index = 0;
		var soundClone;
					
		while(diatonicScale[index] != 4 && index < diatonicScale.length)
			index++;
		
		for(i = 0; i < chords[alternateIndex].length; i++)
		{
			while(diatonicScale[index] == 0 && index < diatonicScale.length) index++; // Scan the diatonicScale for each consecutive note
			scheduleSound(index + (12 - guitar.note), i, chordSettings.volume, chordSettings.speed); // Put it in the sequence
			index++;
		}
	}
});

$("#playScale").click(function(){
	var index = 0;
		
	for(i = 0; i < 8; i++)
	{
		while(guitar.scale[index] == 0) index++; // Scan the diatonicScale for each consecutive note
		scheduleSound(index + guitar.note, i, 1, 1000); // Put it in the sequence, with the note offset added
		index++;
	}
});

chordStyle.onchange = function(){
	if(chordStyle.value == "0")
	{
		chordSettings.speed = 0;
		chordSettings.volume = .25;
	}
	else if(chordStyle.value == "1")
	{
		chordSettings.speed = 150;
		chordSettings.volume = .25;
	}
	else
	{
		chordSettings.speed = 1000;
		chordSettings.volume = 1;
	}	
}

$('input[name="displayToggle"]').change(function(){
	drawGuitar();
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

/* Initiate */

$(document).ready(function(){

	var marginFix;
	var marginFix = document.getElementsByClassName("container")[0].getBoundingClientRect();

	// Once everything is up, fix the automatically generated margin to prevent jumps when the scrollbar comes into play
	$(".container").css("margin-left", marginFix.left + "px"); // Put it back in as an absolute value

	initiateVariables();

	var timer = setInterval(function(){ // Keep the main loop hostage until a certain condition is met
		context.save();
		context.fillStyle = "white";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = "black";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.font = "26px helvetica";
		context.fillText("Loading images and sounds...", canvas.width/2, canvas.height/2);
		context.restore();
			
		if(imageCounter >= totalImages && audioCounter >= totalAudio)
		{
			clearInterval(timer);
			changeScale();
			$("#note").focus();
			drawGuitar(); // Push it so the images have time to load
			printTable();
		}
	}, 16);	
});
