import MediaElementPlugin from "./Plugins/MediaElementPlugin.js";


export default class Player {
  private context: AudioContext
  private activePlugin: AudioPlugin
  plugins: AudioPlugin[]
  constructor(context: AudioContext) {
    this.context = context;

    this.context.createGain();

    this.plugins = [
      new MediaElementPlugin(this.context.destination)
    ];
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

  get ontimeupdate() {
    return this.activePlugin.ontimeupdate;
  }

  set ontimeupdate(fnc) {
    this.activePlugin.ontimeupdate = fnc;
  }

  pause(): void {
    this.activePlugin.pause();
  }

  remove(): void {
    this.activePlugin.remove();
  }

  get paused(): boolean {
    return this.activePlugin.paused;
  }

  get played(): TimeRanges {
    return this.activePlugin.played;
  }

  get currentTime() {
    return this.activePlugin.currentTime;
  }

  set currentTime(num) {
    this.activePlugin.currentTime = num;
  }

  get duration() {
    return this.activePlugin.duration;
  }
}
