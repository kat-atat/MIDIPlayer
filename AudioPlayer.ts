import MediaElementPlugin from "./Plugins/MediaElementPlugin.js";
import SMFPlugin from "./Plugins/SMFPlugin.js";


export default class Player {
  private context: AudioContext
  private activePlugin: AudioPlugin
  plugins: AudioPlugin[]
  constructor(context: AudioContext) {
    this.context = context;

    this.context.createGain();

    this.plugins = [];
    this.plugins.push(new MediaElementPlugin(this.context.destination));
    this.plugins.push(new SMFPlugin(this.context.destination));
  }

  load(data: any) {
    return this.plugins.some((plugin)=> {
      let result = plugin.load(data);
      if (result === true) {
        this.activePlugin = plugin;
      }
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
    return this.activePlugin.paused;
  }

  get currentTime() {
    if (!this.activePlugin) {
      return 0;
    }
    return this.activePlugin.currentTime;
  }

  set currentTime(num) {
    if (!this.activePlugin) {
      return;
    }
    this.activePlugin.currentTime = num;
  }

  get duration() {
    if (!this.activePlugin) {
      return 0;
    }
    return this.activePlugin.duration;
  }
}
