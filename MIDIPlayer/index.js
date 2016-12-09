import UI from "./UI/index.js"
import FileInput from "./UI/FileInput.js"
import InitAudioContext from "./UI/InitAudioContext.js"
import SetSynth from "./UI/SetSynth.js"
import SetParts from "./UI/SetParts.js"
import PlayButton from "./UI/PlayButton.js"


class MIDIPlayer extends HTMLDivElement{
  constructor(){
    super();
  }

  static get extends(){
    return "div";
  }

  createdCallback(){
    this.midi = null;
    this.synth = null;
    this.parts = [];

    this.fileReader = new window.FileReader();
    this.fileReader.addEventListener("load", (e)=>this._fileReaderProcess(e));

    this.ui = new UI();
    this.ui.addEventListener("change", (e)=>this._uiProcess(e));
    this.ui.addEventListener("click", (e)=>this._uiProcess(e));

    this.appendChild(this.ui);
  }

  attachedCallback(){}

  detachedCallback(){}

  attributeChangedCallback(attr, oldVal, newVal){}

  _fileReaderProcess(e){
    if(e.type === "load"){
      this.midi = MidiConvert.create().decode(e.target.result);
      Tone.Transport.bpm.value = this.midi.bpm;
      Tone.Transport.timeSignature = this.midi.timeSignature;
    }
  }

  _uiProcess(e){
    if(e.type === "change"){
      if(e.target.constructor === FileInput){
        this.fileReader.readAsArrayBuffer(e.target.files[0]);
      }
    }

    if(e.type === "click"){
      if(e.target.constructor === InitAudioContext){
        Tone.context.close();
        Tone.setContext(createAudioContext());
      }

      if(e.target.constructor === SetSynth){
        if(!!this.synth){ return false }
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

      if(e.target.constructor === SetParts){
        this.parts = [];
        this.midi.tracks.forEach((track)=>{
          this.parts.push(
            new Tone.Part(
              (time, e)=>this.synth.triggerAttackRelease(e.name, e.duration, time, e.velocity),
              track.notes
            ).start(0)
          );
        });
      }

      if(e.target.constructor === PlayButton){
        if(Tone.Transport.state === "stopped"){ Tone.Transport.start("+0.1", 0) }
        if(Tone.Transport.state === "started"){ Tone.Transport.stop(0) }
      }
    }
  }
}


export default document.registerElement("MIDIPlayer-index", MIDIPlayer);