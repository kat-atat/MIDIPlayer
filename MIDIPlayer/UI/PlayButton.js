class PlayButton extends HTMLButtonElement{
  constructor(){
    super();
  }

  static get extends(){
    return "button";
  }

  createdCallback(){
    this.textContent = "[>]"
  }

  attachedCallback(){}

  detachedCallback(){}

  attributeChangedCallback(attr, oldVal, newVal){}
}


export default document.registerElement("MIDIPlayer-UI-playButton", PlayButton);
