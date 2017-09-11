import AudioPlayer from "./AudioPlayer.js";


window.AudioContext = window.AudioContext||webkitAudioContext;


(function() {
  this.audioContext = new AudioContext();
  this.player = new AudioPlayer(this.audioContext);
  this.playButton = this.querySelector(".playbacks--play");
  this.pauseButton = this.querySelector(".playbacks--pause");
  this.timeRange = this.querySelector(".playbacks--currentTime");
  this.fileInput
  this.fileRemove

  this.playButton.addEventListener("click", ()=> this.player.play());
  this.pauseButton.addEventListener("click", ()=> this.player.pause());
  this.timeRange.addEventListener("change", (event)=>
    this.player.currentTime = (this.timeRange.value / this.timeRange.max) * this.player.duration
  );

  this.player.ontimeupdate = ()=> this.timeRange.value = (this.player.currentTime / this.player.duration) * this.timeRange.max;

}).call(document.querySelector(".audioPlayer"));
