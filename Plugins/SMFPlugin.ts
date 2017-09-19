class SMF {
  private binary: ArrayBuffer
  constructor(binary: ArrayBuffer) {
    this.binary = binary;
  }

  get header() {
    return new SMFHeader(this.binary);
  }

  get isValid(): boolean {
    return this.header.isValid;
  }
}


class SMFHeader {
  private binary: ArrayBuffer
  constructor(binary: ArrayBuffer) {
    this.binary = binary;
  }

  private validChunkType = [0x4d, 0x54, 0x68, 0x64]
  get isValid() {
    return this.chunkType
    .every((item, index)=> item === this.validChunkType[index]);
  }

  get chunkType() {
    return new Uint8Array(this.binary)
    .subarray(0, 4);
  }

  get headerSize() {
    return new Uint8Array(this.binary)
    .subarray(4, 4)
    .reduce((prev, next)=> prev + next)
  }

  get format() {
    return new Uint8Array(this.binary)
    .subarray(8, 2)
    .reduce((prev, next)=> prev + next)
  }

  get tracksNum() {
    return new Uint8Array(this.binary)
    .subarray(10, 2)
    .reduce((prev, next)=> prev + next)
  }
}


export default class SMFPlugin implements AudioPlugin {
  private output: AudioNode
  private smf: SMF
  constructor(output: AudioNode) {
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

  load (data: ArrayBuffer): boolean {
    let smf = new SMF(data);
    let result = smf.isValid;
    if (result === true) {
      this.smf = smf;
    }
    return result;
  }

  play() {
    return void(0);
  }

  pause() {
  }
}
