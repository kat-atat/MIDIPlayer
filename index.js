import AudioPlayer from "./AudioPlayer.js";

// debugger
window.addEventListener("error", (error)=> document.write(error.message||error));

// polyfill
window.AudioContext = window.AudioContext||webkitAudioContext;


(function() {
  this.audioContext = new AudioContext();
  this.audioPlayer = new AudioPlayer(this.audioContext);
  this.fileReader = new FileReader();
  this.playButton = this.querySelector(".playbacks--play");
  this.pauseButton = this.querySelector(".playbacks--pause");
  this.timeRange = this.querySelector(".playbacks--currentTime");
  this.fileInput = this.querySelector(".file--input");

  this.load = (data)=> this.audioPlayer.load(data);

  this.playButton.addEventListener("click", ()=> this.audioPlayer.play());
  this.pauseButton.addEventListener("click", ()=> this.audioPlayer.pause());
  this.timeRange.addEventListener("change", ()=>
    this.audioPlayer.currentTime = (this.timeRange.value / this.timeRange.max) * this.audioPlayer.duration
  );

  this.fileInput.addEventListener("change", ()=> this.fileReader.readAsArrayBuffer(this.fileInput.files[0]));
  this.fileReader.addEventListener("load", ()=> this.audioPlayer.load(this.fileReader.result));

  setInterval(()=>
    this.timeRange.value = (this.audioPlayer.currentTime / this.audioPlayer.duration) * this.timeRange.max, 250);

}).call(document.querySelector(".audioPlayer"));
