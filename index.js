import AudioPlayer from "./AudioPlayer.js";

// debugger
window.addEventListener("error", (error)=> document.write(error.message||error));

// polyfill
window.AudioContext = window.AudioContext||webkitAudioContext;


(function() {
  this.audioContext = new AudioContext();
  this.audioPlayer = new AudioPlayer(this.audioContext);
  this.fileReader = new FileReader();
  this.playback = this.querySelector("input[type=button]");
  this.timeRange = this.querySelectorAll("input[type=range]")[0];
  this.volumeRange = this.querySelectorAll("input[type=range]")[1];
  this.fileInput = this.querySelector("input[type=file]");

  this.isUserInterfacing = false;
  this.load = (data)=> this.audioPlayer.load(data);

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
    if (this.isUserInterfacing === true) {
      return;
    }
    this.timeRange.value = (this.audioPlayer.currentTime / this.audioPlayer.duration) * this.timeRange.max;
    this.volumeRange.value = this.audioPlayer.volume;
  }, 250);

}).call(document.querySelector(".AudioPlayer"));
