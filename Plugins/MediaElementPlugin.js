export default class MediaElementPlugin {
    constructor(output) {
        this.output = output;
    }
    get paused() {
        return this.mediaElement.paused;
    }
    get played() {
        return this.mediaElement.played;
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
    load(data) {
        let result = data instanceof HTMLMediaElement;
        if (result === true) {
            this.mediaElement = data;
            this.mediaElementAudioSource = this.output.context.createMediaElementSource(data);
            this.mediaElementAudioSource.connect(this.output);
        }
        return result;
    }
    play() {
        return this.mediaElement.play();
    }
    get ontimeupdate() {
        return this.mediaElement.ontimeupdate;
    }
    set ontimeupdate(fnc) {
        this.mediaElement.ontimeupdate = fnc;
    }
    pause() {
        return this.mediaElement.pause();
    }
    remove() {
        this.mediaElement = null;
        this.mediaElementAudioSource.disconnect(this.output);
    }
}
