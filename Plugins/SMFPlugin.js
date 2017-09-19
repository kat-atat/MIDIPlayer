class SMF {
    constructor(binary) {
        this.binary = binary;
    }
    get header() {
        return new SMFHeader(this.binary);
    }
    get isValid() {
        return this.header.isValid;
    }
}
class SMFHeader {
    constructor(binary) {
        this.validChunkType = [0x4d, 0x54, 0x68, 0x64];
        this.binary = binary;
    }
    get isValid() {
        return this.chunkType
            .every((item, index) => item === this.validChunkType[index]);
    }
    get chunkType() {
        return new Uint8Array(this.binary)
            .subarray(0, 4);
    }
    get headerSize() {
        return new Uint8Array(this.binary)
            .subarray(4, 4)
            .reduce((prev, next) => prev + next);
    }
    get format() {
        return new Uint8Array(this.binary)
            .subarray(8, 2)
            .reduce((prev, next) => prev + next);
    }
    get tracksNum() {
        return new Uint8Array(this.binary)
            .subarray(10, 2)
            .reduce((prev, next) => prev + next);
    }
}
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
        let smf = new SMF(data);
        let result = smf.isValid;
        if (result === true) {
            this.smf = smf;
        }
        return result;
    }
    play() {
        return void (0);
    }
    pause() {
    }
}
