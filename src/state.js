class State {
  constructor() {
    this._activeScale = null;
  	this._activeMode = null;
  	this._inversion = null;
  	this._displayToggle = null;
  	this._diatonic = null;
  	this._alternateIndex = null;
  	this._alternate = null;
  	this._chordSettings = null;
  	this._guitar = null;
    this._pianoImage = null;
  	// Flags
  	this._showThirdsFlag = true;
  	this._showSeventhsFlag = true;
  	this._showAltFlag = false;
  	this._showSusFlag = false;
  	this._diatonicFlag = false;
  	this._alternateFlag = false;
  	this._susFlag = false;
    // Arrays
    this._activeKey = [];
    this._altChords = [];
    this._activeSusChords = [];
    this._diatonicScale = [];
  }

  get activeScale() { return this._activeScale; }
  set activeScale(activeScale) { this._activeScale = activeScale; }
  get activeMode() { return this._activeMode; }
  set activeMode(activeMode) { this._activeMode = activeMode; }
  get inversion() { return this._inversion; }
  set inversion(inversion) { this._inversion = inversion; }
  get displayToggle() { return this._displayToggle; }
  set displayToggle(displayToggle) { this._displayToggle = displayToggle; }
  get diatonic() { return this._diatonic; }
  set diatonic(diatonic) { this._diatonic = diatonic; }
  get alternateIndex() { return this._alternateIndex; }
  set alternateIndex(alternateIndex) { this._alternateIndex = alternateIndex; }
  get alternate() { return this._alternate; }
  set alternate(alternate) { this._alternate = alternate; }
  get chordSettings() { return this._chordSettings; }
  set chordSettings(chordSettings) { this._chordSettings = chordSettings; }
  get guitar() { return this._guitar; }
  set guitar(guitar) { this._guitar = guitar; }
  get showThirdsFlag() { return this._showThirdsFlag; }
  set showThirdsFlag(showThirdsFlag) { this._showThirdsFlag = showThirdsFlag; }
  get showSeventhsFlag() { return this._showSeventhsFlag; }
  set showSeventhsFlag(showSeventhsFlag) { this._showSeventhsFlag = showSeventhsFlag; }
  get showAltFlag() { return this._showAltFlag; }
  set showAltFlag(showAltFlag) { this._showAltFlag = showAltFlag; }
  get showSusFlag() { return this._showSusFlag; }
  set showSusFlag(showSusFlag) { this._showSusFlag = showSusFlag; }
  get diatonicFlag() { return this._diatonicFlag; }
  set diatonicFlag(diatonicFlag) { this._diatonicFlag = diatonicFlag; }
  get alternateFlag() { return this._alternateFlag; }
  set alternateFlag(alternateFlag) { this._alternateFlag = alternateFlag; }
  get susFlag() { return this._susFlag; }
  set susFlag(susFlag) { this._susFlag = susFlag; }
  get pianoImage() { return this._pianoImage; }
  set pianoImage(pianoImage) { this._pianoImage = pianoImage; }
  get activeKey() { return this._activeKey; }
  set activeKey(activeKey) { this._activeKey = activeKey; }
  get altChords() { return this._altChords; }
  set altChords(altChords) { this._altChords = altChords; }
  get activeSusChords() { return this._activeSusChords; }
  set activeSusChords(activeSusChords) { this._activeSusChords = activeSusChords; }
  get diatonicScale() { return this._diatonicScale; }
  set diatonicScale(diatonicScale) { this._diatonicScale = diatonicScale; }
}

const state = new State();

export default state;
