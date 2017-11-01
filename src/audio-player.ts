import AudioPlayer from "./AudioPlayer.js";


AudioContext = webkitAudioContext||AudioContext; // polyfill

class AudioPlayerElement extends HTMLElement {
  audioContext
  audioPlayer
  fileReader
  playback
  timeRange
  volumeRange
  fileInput
  isUserInterfacing
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = AudioPlayerElement.template;
    this.playback = this.querySelector("input[type=button]");
    this.timeRange = this.querySelectorAll("input[type=range]")[0];
    this.volumeRange = this.querySelectorAll("input[type=range]")[1];
    this.fileInput = this.querySelector("input[type=file]");
    this.audioContext = new AudioContext();
    this.audioPlayer = new AudioPlayer(this.audioContext);
    this.fileReader = new FileReader();
    this.isUserInterfacing = false;

    this.playback.addEventListener("click", ()=> {
      this.audioPlayer.paused
      ? this.audioPlayer.play()
      : this.audioPlayer.pause();
    });

    this.timeRange.addEventListener("change", ()=>
      this.audioPlayer.currentTime = (this.timeRange.value / this.timeRange.max) * this.audioPlayer.duration
    );

    this.volumeRange.addEventListener("change", ()=>
      this.audioPlayer.volume = this.volumeRange.value
    );

    this.fileInput.addEventListener("change", ()=> this.fileReader.readAsArrayBuffer(this.fileInput.files[0]));
    this.fileReader.addEventListener("load", ()=> this.audioPlayer.load(this.fileReader.result));
    this.addEventListener("mousedown", ()=> this.isUserInterfacing = true);
    this.addEventListener("mouseup", ()=> this.isUserInterfacing = false);
    this.addEventListener("touchstart", ()=> this.isUserInterfacing = true);
    this.addEventListener("touchend", ()=> this.isUserInterfacing = false);

    setInterval(()=> {
      if (this.isUserInterfacing === true) return;
      this.update();
    }, 250);
  }

  load(data) {
    this.audioPlayer.load(data);
  }

  private update() {
    this.timeRange.value = this.audioPlayer.currentTime;
    this.timeRange.max = this.audioPlayer.duration;
    this.volumeRange.value = this.audioPlayer.volume;
  }

  static get is() {
    return "audio-player";
  }

  static get template() {
    const host = this.is;
    return `<style>
      ${host}, ${host} * { box-sizing: border-box; }

      ${host} label * { display: none; }

      ${host} .Controlls { display: flex; }
      ${host} .Controlls--fileInput { flex: 0 0 auto; }
      ${host} .Controlls--playback { flex: 0 0 auto; }
      ${host} .Controlls--currentTime { flex: 0 0 auto; }
      ${host} .Controlls--volume { flex: 0 0 auto; }

      ${host} .button {
        display: inline-block;
        min-width: 7mm;
        min-height: 7mm;
      }

      ${host} .Controlls--fileInput,
      ${host} .Controlls--playback {
        border: solid 1px;
        border-radius: 8px;
      }

      ${host} input[type=range] {
        -moz-appearance: none;
        -webkit-appearance: none;

        min-height: 7mm;

        /* chrome minor fix*/
        background: transparent;
      }

      ${host} input[type=range]::-moz-range-track {
        background: transparent;
        height: 2px;
        box-shadow: 0 1px 1px 0 hsla(0, 0%, 0%, 0.3) inset;
      }

      ${host} input[type=range]::-moz-range-thumb {
        background: hsla(0, 0%, 98%, 1);
        box-shadow: 0 1px 2px 1px hsla(0, 0%, 0%, 0.3);
        border: none;
        width: 7mm;
        height: 7mm;
        border-radius: 50%;
      }

      ${host} input[type=range]::-webkit-slider-runnable-track {
        background: linear-gradient(
          to bottom,
          hsla(0, 0%, 0%, 0) 0%,
          hsla(0, 0%, 0%, 0) 45%,
          hsla(0, 0%, 84%, 1) 45%,
          hsla(0, 0%, 84%, 1) 55%,
          hsla(0, 0%, 0%, 0) 55%,
          hsla(0, 0%, 0%, 0) 100%
        );
      }

      ${host} input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        box-sizing: content-box;
        border: none;
        background: hsla(0, 0%, 98%, 1);
        box-shadow: 0 1px 2px 1px hsla(0, 0%, 0%, 0.3);
        width: 7mm;
        height: 7mm;
        border-radius: 50%;
      }


      ${host} input[type=range]::-ms-track {
        height: 16px;
        border: none;
        background: transparent;
        color: transparent;
      }

      ${host} input[type=range]::-ms-fill-upper {
        background: transparent;
        height: 2px;
        box-shadow: 0 1px 1px 0 hsla(0, 0%, 0%, 0.3) inset;
      }

      ${host} input[type=range]::-ms-fill-lower {
        background: transparent;
        height: 2px;
        box-shadow: 0 1px 1px 0 hsla(0, 0%, 0%, 0.3) inset;
      }

      ${host} input[type=range]::-ms-thumb {
        border: none;
        background: hsla(0, 0%, 98%, 1);
        box-shadow: 0 1px 2px 1px hsla(0, 0%, 0%, 0.3);
        width: 7mm;
        height: 7mm;
        border-radius: 50%;
      }
    </style>

    <div class="Controlls">
      <label class="Controlls--fileInput button">
        <input type="file"/>
      </label>

      <label class="Controlls--playback button">
        <input type="button"/>
      </label>

      <div class="Controlls--currentTime">
        <input type="range" value="0" min="0" max="12" step="0.12"/>
      </div>

      <div class="Controlls--volume">
        <input type="range" value="1" min="0" max="1" step="0.125"/>
      </div>
    </div>`;
  }
}


customElements.define(AudioPlayerElement.is, AudioPlayerElement);
