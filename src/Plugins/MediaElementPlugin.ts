export default class MediaElementPlugin implements AudioPlayer.AudioPlugin {
  private mediaElement: HTMLMediaElement = null;
  private sourceNode: MediaElementAudioSourceNode = null;
  private output: AudioNode
  constructor(output: AudioNode) {
    this.output = output;
  }

  get paused() {
    return this.mediaElement.paused;
  }

  get currentTime() {
    return this.mediaElement.currentTime;
  }

  set currentTime(num) {
    this.mediaElement.currentTime = num;
  }

  get duration() {
    return this.mediaElement.duration;
  }

  load (data: HTMLMediaElement): Promise<AudioPlayer.AudioPlugin> {
    this.disconnect();
    return new Promise((resolve, reject)=> {
      if (data instanceof HTMLMediaElement) resolve();
      else reject();
    })
    .then(()=> this.mediaElement = data)
    .then(()=> this.connect())
    .then(()=> this)
  }

  private connect() {
    if (this.sourceNode) return;
    this.sourceNode = this.output.context.createMediaElementSource(this.mediaElement);
    this.sourceNode.connect(this.output);
    this.mediaElement.onended = ()=> this.onended();
  }

  private disconnect() {
    if (!this.sourceNode) return;
    this.sourceNode.disconnect(this.output);
    this.sourceNode = null;
  }

  play() {
    return this.mediaElement.play();
  }

  pause() {
    return this.mediaElement.pause();
  }

  private onended() {
  }
}
