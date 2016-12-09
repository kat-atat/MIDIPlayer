class SetSynth extends HTMLButtonElement{
  constructor(){
    super();
  }

  static get extends(){
    return "button";
  }

  createdCallback(){
    this.textContent = "[SetSynth]";
  }

  attachedCallback(){}

  detachedCallback(){}

  attributeChangedCallback(attr, oldVal, newVal){}
}


export default document.registerElement("MIDIPlayer-UI-setSynth", SetSynth);
