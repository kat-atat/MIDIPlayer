export default class AudioBufferPlugin implements AudioPlayer.AudioPlugin {
  private _paused = true;
  private _currentTime = 0;
  private audioBuffer: AudioBuffer = null;
  private sourceNode: AudioBufferSourceNode = null;
  private output: AudioNode
  private startedTime = 0;
  constructor(output: AudioNode) {
    this.output = output;
  }

  get paused() {
    return this._paused;
  }

  get currentTime() {
    if (this.paused === false) {
      return this._currentTime
        + (this.output.context.currentTime - this.startedTime);
    }
    return this._currentTime;
  }

  set currentTime(num) {
    this._currentTime = num;
    if (this.paused === false) {
      this.disconnect();
      this.connect();
      this.sourceNode.start(0, num);
      this.startedTime = this.output.context.currentTime;
    }
  }

  get duration() {
    if (!this.audioBuffer) return 0;
    return this.audioBuffer.duration;
  }

  load (data: ArrayBuffer): Promise<AudioPlayer.AudioPlugin> {
    return new Promise((resolve, reject)=> {
      this.output.context.decodeAudioData(data, (audioBuffer)=> resolve(audioBuffer), ()=> reject());
    })
    .then((audioBuffer: AudioBuffer)=> this.audioBuffer = audioBuffer)
    .then(()=> this);
  }

  private connect() {
    this.sourceNode = this.output.context.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    this.sourceNode.connect(this.output);
    this.sourceNode.onended = ()=> {
      // BUG: both case FireFox(~58.0b1) is dispatch "ended"
      // 1. when sourceNode.stop() execute
      // 2. when sourceNode reached end of audioBuffer
      // HACK: normalize to case(2) only
      if (this.currentTime < this.duration) return;
      this.onended();
    }
  }

  private disconnect() {
    this.sourceNode.disconnect(this.output);
    this.sourceNode = null;
  }

  play() {
    if (this.paused === false) return void(0);
    this._paused = false;
    this.startedTime = this.output.context.currentTime;
    this.connect();
    this.sourceNode.start(0, this.currentTime);
    return void(0);
  }

  pause() {
    if (this.paused === true) return;
    this._paused = true;
    this._currentTime =
      this._currentTime + (this.output.context.currentTime - this.startedTime);
    this.sourceNode.stop(0);
    this.disconnect();
  }

  private onended() {
    this.currentTime = 0;
    this.pause();
  }
}
