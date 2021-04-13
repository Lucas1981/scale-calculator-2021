import { initiateVariables,	initiateChordSettings, initiateGuitar,	initiateImages } from './initiation.js';
import { renderLoadingScreen, exposeUserInterface, initiateEventHandlers } from './ui-layer.js';
import { initiateSounds } from './sound.js';

/* Event handlers */

initiateEventHandlers();

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
  promises.push(initiateSounds());

  Promise.all(promises).then(() => {
    clearInterval(interval);
    exposeUserInterface();
  });
});
