import FileInput from "./UI/FileInput.js"


class MIDIPlayer extends HTMLDivElement{
  constructor(){
    super();
  }

  static get extends(){
    return "div";
  }

  createdCallback(){

    this.fileInput = new FileInput();
    this.fileReader = new window.FileReader();

    this.synth = null;
    this.midi = null;
    this.addEventListener("click", this._synthInitialize);

    this.fileInput.addEventListener("change", (e)=>{
      this.fileReader.readAsArrayBuffer(e.target.files[0]);
    });

    this.fileReader.addEventListener("load", (e)=>{
      this.midi = MidiConvert.create().decode(e.target.result);
    });


    this.appendChild(this.fileInput);
  }

  attachedCallback(){}

  detachedCallback(){}

  attributeChangedCallback(attr, oldVal, newVal){
    alert(`[changed] ${attr}: ${oldVal} -> ${newVal}`);
  }

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

  play(){
    var playNote = (time, event)=>this.synth.triggerAttackRelease(event.name, event.duration, time, event.velocity);

    new Tone.Part(playNote, midi.tracks[0].notes).start(0);
    new Tone.Part(playNote, midi.tracks[0].notes).start(0);

    Tone.Transport.bpm.value = this.midi.bpm;
    Tone.Transport.timeSignature = this.midi.timeSignature;
    Tone.Transport.start("+0.1", 0);
  }
}


export default document.registerElement("custom-div", MIDIPlayer);