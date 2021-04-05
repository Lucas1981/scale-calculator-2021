/* Functions */

function changeScale() // This one, together with calculateDiationicScale is the meat of the program
{
	var i, j, k, index;
	var foundChordFlag;
	var scaleOffset;
	var keyIncrease = 0;
    var scaleIncrease = 0;
    var flatCorrection = 0;
    var sharpCorrection = 0;
	
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
			guitar.noteNames[index + (j * 12)] = activeKey[i];
			guitar.romanNames[index + (j * 12)] = roman[i];
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
	
	// Check where the sus chords are
	index = 0;
	for(i = 0; i < 7; i++) // Do this for every step
	{
		k = 0; // Reset the interval indexing
		foundChordFlag = true; // Assume the chord will pass the test
		activeSusChords[i] = 0; // Assume the chord won't be indexed
		while(k < 4 && foundChordFlag == true) // Test the chord
		{
			if(guitar.scale[index + susChord[k]] == 0) foundChordFlag = false; // If the interval falls through, move on
			else k++;
		}
		if(foundChordFlag == true)
			activeSusChords[i] = 1; // If the flag is still up, the chord is there
		index += scales[activeScale][i];
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
	
	printTable();

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
			if(limit == SEVENTH)
				guitar.relations[index + offset + (j * 12)] = seventhRelations[inversion][i-1];
			else
				guitar.relations[index + offset + (j * 12)] = triadRelations[inversion][i-1];					
				
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
			guitar.relations[index + offset + (j * 12)] = seventhRelations[inversion][i-1];
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

function calculateSusScale()
{
	var i, j, k, index;
	var offset = 0;

	if(activeSusChords[diatonic] == true) // Only do this if the sus chord is actually in there
	{
		// First, reset the scale
		for(i = 0; i < guitar.fretsPerLine * guitar.strings; i++) diatonicScale[i] = 0;
	
		// Next, find the offset
		for(i = 0; i < diatonic; i++) offset += scales[activeScale][i + activeMode]; // Get the church mode in
			
		// If it is, load in the proper chord, converting the interval values to (almost) boolean scale values	
		i = 0;
		index = 0;
		do
		{
			for(j = 0; j < 8; j++)
			{
				guitar.relations[index + offset + (j * 12)] = susRelations[inversion][i-1];
				if(index - susChord[inversion] == 0)
					diatonicScale[index + offset + (j * 12)] = 2; // force the root-note in there
				else
					diatonicScale[index + offset + (j * 12)] = 1;
			}
			index = susChord[i]; // Get the church mode in there
			i++;
		} while(i <= 3);
		
		susFlag = true; // Only do this when all the calculations have been executed, otherwiste the whole thing might crash.
	
		drawGuitar();
	}
	else // Otherwise, block the display
		susFlag = false;
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
		// Remove the sus class if it's there, then conditionally add it again
		if($(".susChord:eq(" + i + ")").hasClass("activeSusChord"))
		{
			$(".susChord:eq(" + i + ")").removeClass("activeSusChord");
		}
		$(".susChord:eq(" + i + ")").html("");
		
		if(activeSusChords[i] == 1)
		{
			$(".susChord:eq(" + i + ")").addClass("activeSusChord");
			$(".susChord:eq(" + i + ")").html(activeKey[i] + " sus4");
		}
		
		totalChords = "";
		
		for(j = 0; j < chords.length; j++)
		{
			if(altChords[i][j] == 1)
				totalChords += "<div class=\"altChord\" id=" + i + "-" + j + ">" + activeKey[i] + " " + chordNames[j] + "</div>";				
		}
		$(".enharmonicChord:eq(" + i + ")").html(totalChords);
		
		totalKey += activeKey[i] + " ";
	}
	$("#scale").empty();
	$("#scale").html(totalKey);

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

	if(showSusFlag == true)
	{
		$(".susChord").show();
		$("#susHeader").show();
	}
	if(showSusFlag == false)
	{
		$(".susChord").hide();
		$("#susHeader").hide();
	}

	// Event handlers have to be reset in real time. Ugly? Yes. But I can't get it to work if I wrap it in a function.

	// Out with the old
	$(".altChord").unbind("mouseenter mouseleave click");	
	
	// In with the new
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
	
	$(".altChord").click(function(){ // Since the altChord index is established somewhere else, this one can stay static
		if(alternateFlag == true) // Only do this when the alternateFlag is up
		{
			var i;
			var index = 0;
						
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

	// Out with the old
	$(".susChord").unbind("mouseenter mouseleave click");
	
	// In with the new
	$(".activeSusChord").mouseenter(function(){	
		inversion = parseInt($('input[name="susInversions"]:checked').val());
		diatonic = $(".susChord").index(this);
		calculateSusScale();
	});
	
	$(".activeSusChord").mouseleave(function(){
		susFlag = false;
		drawGuitar();
	});
	
	$(".activeSusChord").click(function(){
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
	
	drawGuitar();
}

function drawGuitar()
{
	var i, j, index;
	var width, height;
	
	dotsSetting = parseInt(dots.value);
	ringsSetting = parseInt(rings.value)

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
					
					context.save();
					context.fillStyle = "white";
					context.textAlign = "center";
					context.textBaseline = "middle";
					context.font = "10px helvetica";
					if(dotsSetting == 1)
						context.fillText(guitar.noteNames[i + guitar.tuning[j] + guitar.note], 16 + (i * width), 16 + (j * height));
					if(dotsSetting == 2)
						context.fillText(guitar.romanNames[i + guitar.tuning[j] + guitar.note], 16 + (i * width), 16 + (j * height));					
					context.restore();
				}
			}
		}
		
		// If the diatonic flag is up, display the proper diatonic chord
		if(diatonicFlag == true || alternateFlag == true || susFlag == true)
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
						
						if(ringsSetting == 1)
						{
							context.save();
							context.fillStyle = "black";
							context.textAlign = "center";
							context.textBaseline = "middle";
							context.font = "10px helvetica";
							context.fillText(guitar.relations[i + guitar.tuning[j] + guitar.note], 16 + (i * width), 28 + (j * height));					
							context.restore();
						}
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

				context.save();
				context.fillStyle = "white";
				context.textAlign = "center";
				context.textBaseline = "middle";
				context.font = "12px helvetica";
				if(dotsSetting == 1)
					context.fillText(guitar.noteNames[i + guitar.note + 8], 27 + (pianoJumps[i] * 27), (pianoKeys[i] * 100) + 66);
				if(dotsSetting == 2)
					context.fillText(guitar.romanNames[i + guitar.note + 8], 27 + (pianoJumps[i] * 27), (pianoKeys[i] * 100) + 66);				
				context.restore();
			}
		}
		
		// If the diatonic flag is up, show the chord
		if(diatonicFlag == true || susFlag == true || alternateFlag == true)
		{
			for(i = 0; i < 12 * 2; i++)
			{
				index = diatonicScale[i + guitar.note + 8];
				if(index != 0)
				{
					index--;
					context.drawImage(guitar.chordImages[index], 11+ (pianoJumps[i] * 27), (pianoKeys[i] * 100) + 50);
					if(ringsSetting == 1)
					{
						context.save();
						context.fillStyle = "black";
						context.textAlign = "center";
						context.textBaseline = "middle";
						context.font = "10px helvetica";
						context.fillText(guitar.relations[i + guitar.note + 8], 27 + (pianoJumps[i] * 27), (pianoKeys[i] * 100) + 78);					
						context.restore();
					}
				}
			}
		}
	}
}

function scheduleSound(index, timeStretch, volume, speed)
{
	setTimeout(function(){
		/*var track = mySound[index].cloneNode();
		track.volume = volume;
		track.play();*/
		audioChannels[audioQueue].src = mySound[index].src
		audioChannels[audioQueue].load();
		audioChannels[audioQueue].volume = volume;
		audioChannels[audioQueue].play();

		if(audioQueue == 31) audioQueue = 0;
		else audioQueue++;
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

dots.onchange = function()
{
	dotsSetting = 0;
	drawGuitar();
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
	
	while(diatonicScale[index] != 2) index++;
	
	for(i = 0; i < chords[guitar.chords[diatonic]].length; i++)
	{
		while(diatonicScale[index] == 0) index++; // Scan the diatonicScale for each consecutive note
		scheduleSound(index + (12 - guitar.note), i, chordSettings.volume, chordSettings.speed); // Put it in the sequence, with the note offset added
		index++;
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

/* Initiate */

$(document).ready(function(){

	var marginFix;
	var marginFix = document.getElementsByClassName("container")[0].getBoundingClientRect();

	// Once everything is up, fix the automatically generated margin to prevent jumps when the scrollbar comes into play
	$(".container").css("margin-left", marginFix.left + "px"); // Put it back in as an absolute value

	initiateVariables();

	var timer = setInterval(function(){ // Keep the main loop hostage until a certain condition is met
		context.save();
		context.fillStyle = "#cccccc";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = "black";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.font = "26px helvetica";
		context.fillText("Loading images and sounds...", 960/2, canvas.height/2);
		context.restore();
		
		if(imageCounter >= totalImages && audioCounter >= totalAudio)
		{
			clearInterval(timer);
			changeScale();
			$(".option").show();
			$("#tableControls").show();
			$("#note").focus();
			printTable();	
		}
	}, 16);	
});