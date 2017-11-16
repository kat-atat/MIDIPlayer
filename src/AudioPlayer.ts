import AudioBufferPlugin from "./plugins/AudioBufferPlugin.js";
import MediaElementPlugin from "./plugins/MediaElementPlugin.js";
import SMFPlugin from "./Plugins/SMFPlugin/SMFPlugin.js";


export default class AudioPlayer {
  private activePlugin: AudioPlayer.AudioPlugin = null;
  private context: AudioContext
  private gain: GainNode
  private plugins: AudioPlayer.AudioPlugin[] = [];
  constructor(context: AudioContext) {
    this.context = context;
    this.gain = this.context.createGain();

    this.plugins.push(new AudioBufferPlugin(this.gain));
    this.plugins.push(new MediaElementPlugin(this.gain));
    this.plugins.push(new SMFPlugin(this.gain));
    this.gain.connect(this.context.destination);
  }

  load(data: HTMLMediaElement | ArrayBuffer): Promise<AudioPlayer> {
    return new Promise((resolve)=> {
      Promise.all(
        this.plugins.map((plugin)=> plugin.load(data)
        .then((plugin)=> this.activePlugin = plugin))
      )
      .then(()=> resolve())
      .catch(()=> resolve());
    })
    .then(()=> this);
  }

  play(): Promise<void> {
    return this.activePlugin.play();
  }

  pause(): void {
    this.activePlugin.pause();
  }

  get paused(): boolean {
    if (!this.activePlugin) return true;
    return this.activePlugin.paused;
  }

  get currentTime() {
    if (!this.activePlugin) return 0;
    return this.activePlugin.currentTime;
  }

  set currentTime(num) {
    if (!this.activePlugin) return;
    if (this.duration - 3 <= num) num = this.duration - 3;
    this.activePlugin.currentTime = num;
  }

  get duration() {
    if (!this.activePlugin) return 0;
    return this.activePlugin.duration;
  }

  get volume() {
    return this.gain.gain.value;
  }

  set volume(num) {
    this.gain.gain.value = num;
  }
}
