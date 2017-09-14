import AudioPlayer from "../AudioPlayer.js";


let template = document.createElement("template");
template.innerHTML =
`<div class="AudioPlayer">
  <div class="AudioPlayer--controlls controlls">
    <label class="controlls--fileInput button">
      <input type="file" hidden/>
    </label>

    <label class="controlls--playback button">
      <input type="button" hidden/>
    </label>

    <input class="controlls--currentTime" type="range" value="0" min="0" max="12" step="0.12"/>
  </div>
</div>`;


export default class AudioPlayerElement extends HTMLElement {
  private audioContext: AudioContext
  private audioPlayer: AudioPlayer
  private fileReader = new FileReader()
  private playback: HTMLInputElement
  private timeRange: HTMLInputElement
  private fileInput: HTMLInputElement
  private isUserInterfacing = false;
  constructor(context?: AudioContext) {
    super();

    let documentFragment = template.content.cloneNode(true);
    this.appendChild(documentFragment);
    this.playback = <HTMLInputElement> this.querySelector("input[type=button]");
    this.timeRange = <HTMLInputElement> this.querySelector("input[type=range]");
    this.fileInput = <HTMLInputElement> this.querySelector("input[type=file]");

    this.audioContext = context||new AudioContext();
    this.audioPlayer = new AudioPlayer(this.audioContext);

    this.playback.addEventListener("click", ()=> {
      this.audioPlayer.paused
      ? this.audioPlayer.play()
      : this.audioPlayer.pause();
    });

    this.timeRange.addEventListener("change", ()=> {
      let position = Number(this.timeRange.value) / Number(this.timeRange.max);
      this.audioPlayer.currentTime = position * this.audioPlayer.duration;
    });

    this.fileInput.addEventListener("change", ()=> this.fileReader.readAsArrayBuffer(this.fileInput.files[0]));
    this.fileReader.addEventListener("load", ()=> this.audioPlayer.load(this.fileReader.result));

    this.addEventListener("mousedown", ()=> this.isUserInterfacing = true);
    this.addEventListener("mouseup", ()=> this.isUserInterfacing = false);
    this.addEventListener("touchstart", ()=> this.isUserInterfacing = true);
    this.addEventListener("touchend", ()=> this.isUserInterfacing = false);

    setInterval(()=> {
      if (this.isUserInterfacing === true) {
        return;
      }
      let position = this.audioPlayer.currentTime / this.audioPlayer.duration;
      this.timeRange.value = (position * Number(this.timeRange.max)).toString();
    }, 250);
  }

  load(data) {
    this.audioPlayer.load(data);
  }
}


customElements.define("audio-player", AudioPlayerElement);
