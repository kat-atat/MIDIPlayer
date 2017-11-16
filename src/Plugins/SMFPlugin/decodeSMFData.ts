// import "/node_modules/midiconvert/build/MidiConvert.js";


class SMFBuffer implements AudioPlayer.SMFBuffer {
  smf: AudioPlayer.SMF
  private _duration: number
  constructor(smf: AudioPlayer.SMF) {
    this.smf = smf;
    this._duration =
      this.smf.tracks
      .reduce((prev, next)=> Math.max(prev, next.duration), 0);
  }

  get duration() {
    return this._duration;
  }
}


export default async function decodeSMFData(arrayBuffer: ArrayBuffer) {
  let decoder = MidiConvert.create().decode;
  return new Promise((resolve)=> resolve(decoder(arrayBuffer)))
  .then((decoded: AudioPlayer.SMF)=> new SMFBuffer(decoded));
}
