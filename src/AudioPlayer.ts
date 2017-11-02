import AudioBufferPlugin from "./plugins/AudioBufferPlugin.js";
import SMFPlugin from "./Plugins/SMFPlugin.js";
import MediaElementPlugin from "./plugins/MediaElementPlugin.js";


export default class Player {
  private context: AudioContext
  private activePlugin: AudioPlugin
  private gain: GainNode
  private DC: DynamicsCompressorNode
  plugins: AudioPlugin[]
  constructor(context: AudioContext) {
    this.context = context;
    this.gain = this.context.createGain();
    this.DC = this.context.createDynamicsCompressor();

    this.gain.connect(this.DC);
    this.DC.connect(this.context.destination);

    this.plugins = [];
    this.plugins.push(new AudioBufferPlugin(this.gain));
    this.plugins.push(new MediaElementPlugin(this.gain));
    this.plugins.push(new SMFPlugin(this.gain));
  }

  load(data: any) {
    return this.plugins.some((plugin)=> {
      let result = plugin.load(data);
      if (result === true) this.activePlugin = plugin;
      return result;
    });
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
