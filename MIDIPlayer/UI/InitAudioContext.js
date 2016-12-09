class InitAudioContext extends HTMLButtonElement{
  constructor(){
    super();
  }

  static get extends(){
    return "button";
  }

  createdCallback(){
    this.textContent = "[InitAudioContext]";
  }

  attachedCallback(){}

  detachedCallback(){}

  attributeChangedCallback(attr, oldVal, newVal){}
}


export default document.registerElement("MIDIPlayer-UI-InitAudioContext", InitAudioContext);
