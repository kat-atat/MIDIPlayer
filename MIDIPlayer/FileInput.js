class FileInput extends HTMLInputElement{
  constructor(){
    super();
  }

  static get extends(){
    return "input";
  }

  createdCallback(){
    this.type = "file";
    this.accept = "audio/midi";
  }

  attachedCallback(){}

  detachedCallback(){}

  attributeChangedCallback(attr, oldVal, newVal){}
}


export default document.registerElement("custom-input", FileInput);
