import MediaElementPlugin from "./Plugins/MediaElementPlugin.js";
import AudioBufferPlugin from "./plugins/AudioBufferPlugin.js";
export default class Player {
    constructor(context) {
        this.context = context;
        this.gain = this.context.createGain();
        this.DC = this.context.createDynamicsCompressor();
        this.input = this.gain;
        this.output = this.DC;
        this.input.connect(this.output);
        this.output.connect(this.context.destination);
        this.plugins = [];
        this.plugins.push(new MediaElementPlugin(this.input));
        this.plugins.push(new AudioBufferPlugin(this.input));
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
        if (!this.activePlugin) {
            return true;
        }
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
        if (this.duration - 3 <= num) {
            num = this.duration - 3;
        }
        this.activePlugin.currentTime = num;
    }
    get duration() {
        if (!this.activePlugin) {
            return 0;
        }
        return this.activePlugin.duration;
    }
    get volume() {
        return this.gain.gain.value;
    }
    set volume(num) {
        this.gain.gain.value = num;
    }
}
