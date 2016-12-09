class SetParts extends HTMLButtonElement{
  constructor(){
    super();
  }

  static get extends(){
    return "button";
  }

  createdCallback(){
    this.textContent = "[SetParts]";
  }

  attachedCallback(){}

  detachedCallback(){}

  attributeChangedCallback(attr, oldVal, newVal){}
}


export default document.registerElement("MIDIPlayer-UI-setParts", SetParts);
