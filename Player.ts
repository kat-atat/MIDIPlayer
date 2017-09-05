class Player {
  private context: AudioContext;
  constructor() {
    this.context = new AudioContext();
    this.context.createOscilatorNode();
  }
}
