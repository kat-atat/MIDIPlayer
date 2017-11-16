import createSMFSourceNode from "./createSMFSourceNode.js";
import decodeSMFData from "./decodeSMFData.js";


export default class SMFPlugin implements AudioPlayer.AudioPlugin {
  paused = true;
  currentTime = 0;
  duration = 0;
  private smfBuffer: AudioPlayer.SMFBuffer = null;
  private sourceNode: AudioPlayer.SMFSourceNode = null;
  private output: AudioNode
  constructor(output: AudioNode) {
    this.output = output;
  }

  load (data: ArrayBuffer): Promise<AudioPlayer.AudioPlugin> {
    if (this.sourceNode) this.disconnect();
    return decodeSMFData.call(this.output.context)
    .then((smfBuffer: AudioPlayer.SMFBuffer)=> this.smfBuffer = smfBuffer)
    .then(()=> this.connect())
    .then(()=> this);
  }

  private connect() {
    this.sourceNode = createSMFSourceNode.call(this.output.context);
    this.sourceNode.buffer = this.smfBuffer;
    this.sourceNode.connect(this.output);
  }

  private disconnect() {
    this.sourceNode.disconnect(this.output);
    this.sourceNode = null;
  }

  play() {
    if (this.paused === false) return;
    this.paused = false;
    this.sourceNode.start(0, this.currentTime);
    return void(0);
  }

  pause() {
    if (this.paused === true) return;
    this.paused = true;
    this.sourceNode.stop(0);
  }
}
