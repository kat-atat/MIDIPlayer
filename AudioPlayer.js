import MediaElementPlugin from "./Plugins/MediaElementPlugin.js";
import AudioBufferPlugin from "./plugins/AudioBufferPlugin.js";
export default class Player {
    constructor(context) {
        this.context = context;
        this.context.createGain();
        this.plugins = [];
        this.plugins.push(new MediaElementPlugin(this.context.destination));
        this.plugins.push(new AudioBufferPlugin(this.context.destination));
    }
    load(data) {
        return this.plugins.some((plugin) => {
            let result = plugin.load(data);
            if (result === true) {
                this.activePlugin = plugin;
            }
            return result;
        });
    }
    play() {
        return this.activePlugin.play();
    }
    pause() {
        this.activePlugin.pause();
    }
    get paused() {
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
