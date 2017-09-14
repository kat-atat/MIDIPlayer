export default class AudioBufferPlugin {
    constructor(output) {
        this._paused = true;
        this._currentTime = 0;
        this.startedTime = 0;
        this.output = output;
    }
    get paused() {
        return this._paused;
    }
    get currentTime() {
        if (this.paused === true) {
            return this._currentTime;
        }
        else {
            return this._currentTime + (this.output.context.currentTime - this.startedTime);
        }
    }
    set currentTime(num) {
        if (this.paused === false) {
            this.pause();
            this._currentTime = num;
            this.play();
        }
        else {
            this._currentTime = num;
        }
    }
    get duration() {
        if (!this.audioBuffer) {
            return 0;
        }
        return this.audioBuffer.duration;
    }
    load(data) {
        let result = data instanceof ArrayBuffer;
        if (result === true) {
            this.pause();
            this.audioBuffer = null;
            this._currentTime = 0;
            new Promise((resolve, reject) => this.output.context.decodeAudioData(data, resolve, reject))
                .then((audioBuffer) => this.audioBuffer = audioBuffer);
        }
        return result;
    }
    play() {
        if (this.paused === false || !this.audioBuffer) {
            return void (0);
        }
        this.audioBufferSourceNode = this.output.context.createBufferSource();
        this.audioBufferSourceNode.buffer = this.audioBuffer;
        this.audioBufferSourceNode.connect(this.output);
        this.audioBufferSourceNode.start(0, this.currentTime);
        this.audioBufferSourceNode.onended = () => {
            this.pause();
            this._currentTime = 0;
        };
        this._paused = false;
        this.startedTime = this.output.context.currentTime;
        return void (0);
    }
    pause() {
        if (this.paused === true) {
            return;
        }
        this.audioBufferSourceNode.stop(0);
        this.audioBufferSourceNode.disconnect(this.output);
        this._currentTime = this._currentTime + (this.output.context.currentTime - this.startedTime);
        this._paused = true;
    }
}
