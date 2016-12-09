var XFooButtonPrototype = Object.create(HTMLButtonElement.prototype);
XFooButtonPrototype.createdCallback = function() {
  this.textContent = "I'm an x-foo button!";
};

var XFooButton = document.registerElement('x-foo-button', {
  prototype: XFooButtonPrototype,
  extends: 'button'
});

export default XFooButton;
