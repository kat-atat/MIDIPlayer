export default class AudioBufferPlugin implements AudioPlugin {
  private output: AudioNode
  private audioBuffer: AudioBuffer
  private audioBufferSourceNode: AudioBufferSourceNode
  private _paused = true
  constructor(output: AudioNode) {
    this.output = output;
  }

  get paused() {
    return this._paused;
  }

  get currentTime() {
    return 0;
  }

  set currentTime(num) {
    if (!this.audioBufferSourceNode) {
      return;
    }
    this.audioBufferSourceNode.stop(0);
    this.audioBufferSourceNode.disconnect(this.output);
    this.audioBufferSourceNode = this.output.context.createBufferSource();
    this.audioBufferSourceNode.buffer = this.audioBuffer;
    this.audioBufferSourceNode.connect(this.output);
    this.audioBufferSourceNode.start(0, num);
  }

  get duration() {
    if (!this.audioBuffer) {
      return 0;
    }
    return this.audioBuffer.duration;
  }

  load (data: ArrayBuffer): boolean {
    let result = data instanceof ArrayBuffer;
    if (result === true) {
      this.pause();
      new Promise((resolve, reject)=> this.output.context.decodeAudioData(data, resolve, reject))
      .then((audioBuffer: AudioBuffer)=> this.audioBuffer = audioBuffer);
    }
    return result;
  }

  play() {
    if (!this.audioBuffer || this.audioBufferSourceNode) {
      return void(0);
    }
    this.audioBufferSourceNode = this.output.context.createBufferSource();
    this.audioBufferSourceNode.buffer = this.audioBuffer;
    this.audioBufferSourceNode.connect(this.output);
    this.audioBufferSourceNode.start(0);
    this._paused = false;
    return void(0);
  }

  pause() {
    if (!this.audioBufferSourceNode) {
      return;
    }
    this.audioBufferSourceNode.stop(0);
    this.audioBufferSourceNode.disconnect(this.output);
    this._paused = true;
  }
}
