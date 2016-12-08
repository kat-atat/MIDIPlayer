import FileInput from "./FileInput.js"


class MIDIPlayer extends HTMLDivElement{
  constructor(){
    super();
  }

  static get extends(){
    return "div";
  }

  createdCallback(){

    this.fileReader = new window.FileReader();
    this.fileInput = new FileInput();

    this.synth = null;
    this.addEventListener("click", this._synthInitialize);

    this.fileReader.onload = (e)=>{
      var midi = MidiConvert.create().decode(e.target.result);
      var playNote = (time, event)=>this.synth.triggerAttackRelease(event.name, event.duration, time, event.velocity);

      // play right and left hand with a poly synth
      var rightHand = midi.tracks[0].notes;
      var leftHand = (midi.tracks[1]||midi.tracks[0]).notes;

      // make sure you set the tempo before you schedule the events
      Tone.Transport.bpm.value = midi.bpm;
      Tone.Transport.timeSignature = midi.timeSignature;

      var rightHandPart = new Tone.Part(playNote, rightHand).start(0);
      var leftHandPart = new Tone.Part(playNote, leftHand).start(0);
      Tone.Transport.start("+0.1", 0);
    };

    this.fileInput.addEventListener("change", (e)=>{
      this.fileReader.readAsArrayBuffer(e.target.files[0]);
    });

    this.appendChild(this.fileInput);
  }

  attachedCallback(){}

  detachedCallback(){}

  attributeChangedCallback(attr, oldVal, newVal){}

  _synthInitialize(){
    this.synth = new Tone.PolySynth(8, Tone.Synth, {
      "oscillator": {
        "type": "sine3"
      },
      "envelope": {
        "attack": 0.03,
        "decay": 0.1,
        "sustain": 0.2,
        "release": 0.6
      }
    }).toMaster();
  }
}


export default document.registerElement("custom-div", MIDIPlayer);
