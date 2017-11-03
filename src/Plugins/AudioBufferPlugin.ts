export default class AudioBufferPlugin implements AudioPlugin {
  private fileReader = new FileReader();
  private output: AudioNode
  private audioBuffer: AudioBuffer
  private audioBufferSourceNode: AudioBufferSourceNode
  private _paused = true
  private _currentTime = 0
  private startedTime = 0
  constructor(output: AudioNode) {
    this.output = output;
    this.fileReader.addEventListener("load", ()=> this.setAudioBuffer(this.fileReader.result));
  }

  get paused() {
    return this._paused;
  }

  get currentTime() {
    if (this.paused === true) {
      return this._currentTime;
    }
    else {
      return this._currentTime + (this.output.context.currentTime - this.startedTime)
    }
  }

  set currentTime(num) {
    if (this.paused === false) {
      this.pause();
      this._currentTime = num;
      this.play();
    }
    else {
      this._currentTime = num;
    }
  }

  get duration() {
    if (!this.audioBuffer) {
      return 0;
    }
    return this.audioBuffer.duration;
  }

  load (data: File): boolean {
    let result = this.validation(data);
    if (result === true) {
      this.pause();
      this._currentTime = 0;
      this.fileReader.readAsArrayBuffer(data);
    }
    return result;
  }

  private validation(data: File): boolean {
    let result = AudioBufferPlugin.allowedMimeTypes
    .some((type)=> type === data.type);
    return result;
  }

  private static get allowedMimeTypes() {
    return [
      "audio/wav",
      "audio/x-wav",
      "audio/mpeg",
      "audio/mp3",
      "audio/m4a",
      "audio/x-m4a",
      "audio/ogg",
    ];
  }

  private setAudioBuffer(data: ArrayBuffer) {
    this.audioBuffer = null;
    new Promise((resolve, reject)=> this.output.context.decodeAudioData(data, resolve, reject))
    .then((audioBuffer: AudioBuffer)=> this.audioBuffer = audioBuffer);
  }

  play() {
    if (this.paused === false || !this.audioBuffer) {
      return void(0);
    }
    this.audioBufferSourceNode = this.output.context.createBufferSource();
    this.audioBufferSourceNode.buffer = this.audioBuffer;
    this.audioBufferSourceNode.connect(this.output);
    this.audioBufferSourceNode.start(0, this.currentTime);
    this.audioBufferSourceNode.onended = ()=> {
      if (this.duration <= this.currentTime) {
        this.pause();
        this._currentTime = 0;
      }
    }
    this._paused = false;
    this.startedTime = this.output.context.currentTime;
    return void(0);
  }

  pause() {
    if (this.paused === true) {
      return;
    }
    this.audioBufferSourceNode.stop(0);
    this.audioBufferSourceNode.disconnect(this.output);
    this._currentTime = this._currentTime + (this.output.context.currentTime - this.startedTime);
    this._paused = true;
  }
}
