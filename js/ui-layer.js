function printTable() {
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

function drawGuitar() {
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
