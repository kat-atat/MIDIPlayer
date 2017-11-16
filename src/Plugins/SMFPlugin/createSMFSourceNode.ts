// import "/node_modules/tone/build/Tone.min.js";


class SMFSourceNode implements AudioPlayer.SMFSourceNode {
  channelCount
  channelCountMode
  channelInterpretation
  numberOfInputs
  numberOfOutputs
  addEventListener
  dispatchEvent
  removeEventListener
  connect
  disconnect
  private _buffer: AudioPlayer.SMFBuffer = null;
  private synthes = [];
  context: AudioContext
  constructor(context: AudioContext) {
    this.context = context;
  }

  get buffer() {
    return this._buffer;
  }

  set buffer(smfBuffer: AudioPlayer.SMFBuffer) {
    if (this._buffer !== null) return;
    this._buffer = smfBuffer;
    Tone.Transport.bpm.value = smfBuffer.smf.header.bpm;
    Tone.Transport.timeSignature = smfBuffer.smf.header.timeSignature;
    smfBuffer.smf.tracks.forEach((track)=> {
      let synth = new Tone.PolySynth(8, Tone.Synth, {
        "oscillator": {"type": "sine3"},
        "envelope": {
          "attack": 0.03,
          "decay": 0.1,
          "sustain": 0.2,
          "release": 0.6
        }
      });
      this.synthes.push(synth);
      synth.toMaster();
      new Tone.Part((time, e)=> synth.triggerAttackRelease(e.name, e.duration, time, e.velocity), track.notes).start(0)
    });
  }

  start(when?: number, offset?: number, duration?: number) {
    if (Tone.Transport.state === "started") return;
    Tone.Transport.start("+0.1", 0);
  }

  stop(when?: number) {
    if (Tone.Transport.state === "stopped") return;
    Tone.Transport.stop(0);
  }

  onended() {
  }
}


export default function createSMFSourceNode() {
  Tone.setContext(this);
  return new SMFSourceNode(this);
}
