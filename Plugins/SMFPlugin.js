export default class SMFPlugin {
    constructor(output) {
        this.output = output;
    }
    get paused() {
        return true;
    }
    get currentTime() {
        return 0;
    }
    set currentTime(num) {
    }
    get duration() {
        return 0;
    }
    load(data) {
        let result;
        if (data instanceof ArrayBuffer) {
            // TODO: add test logic
            result = true;
        }
        else {
            result = false;
        }
        return result;
    }
    play() {
        return void (0);
    }
    pause() {
    }
}
