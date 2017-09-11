import MediaElementPlugin from "./Plugins/MediaElementPlugin.js";
export default class Player {
    constructor(context) {
        this.context = context;
        this.context.createGain();
        this.plugins = [
            new MediaElementPlugin(this.context.destination)
        ];
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
    get ontimeupdate() {
        return this.activePlugin.ontimeupdate;
    }
    set ontimeupdate(fnc) {
        this.activePlugin.ontimeupdate = fnc;
    }
    pause() {
        this.activePlugin.pause();
    }
    remove() {
        this.activePlugin.remove();
    }
    get paused() {
        return this.activePlugin.paused;
    }
    get played() {
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
