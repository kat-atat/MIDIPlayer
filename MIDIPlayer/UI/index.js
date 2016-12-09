import FileInput from "./FileInput.js"
import InitAudioContext from "./InitAudioContext.js"
import SetSynth from "./SetSynth.js"
import SetParts from "./SetParts.js"
import PlayButton from "./PlayButton.js"


class UI extends HTMLDivElement{
  constructor(){
    super();
  }

  static get extends(){
    return "div";
  }

  createdCallback(){

    this.initAudioContext = new InitAudioContext();
    this.fileInput = new FileInput();
    this.setSynth = new SetSynth();
    this.setParts = new SetParts();
    this.playButton = new PlayButton();

    this.appendChild(this.initAudioContext);
    this.appendChild(this.fileInput);
    this.appendChild(this.setSynth);
    this.appendChild(this.setParts);
    this.appendChild(this.playButton);
  }

  attachedCallback(){}

  detachedCallback(){}

  attributeChangedCallback(attr, oldVal, newVal){}
}


export default document.registerElement("MIDIPlayer-UI-index", UI);
