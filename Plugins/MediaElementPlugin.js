export default class MediaElementPlugin {
    constructor(output) {
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
    pause() {
        return this.mediaElement.pause();
    }
}
