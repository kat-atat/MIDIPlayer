export default class MediaElementPlugin implements AudioPlugin {
  private output: AudioNode
  private mediaElement: HTMLMediaElement
  private mediaElementAudioSource: MediaElementAudioSourceNode
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

  load (data): boolean {
    let result = this.validation(data);
    if (result === true) {
      this.mediaElement = data;
      this.mediaElementAudioSource = this.output.context.createMediaElementSource(data);
      this.mediaElementAudioSource.connect(this.output);
    }

    return result;
  }

  private validation(data): boolean {
    let result = data instanceof HTMLMediaElement;
    return result;
  }

  play() {
    return this.mediaElement.play();
  }

  pause() {
    return this.mediaElement.pause();
  }
}
