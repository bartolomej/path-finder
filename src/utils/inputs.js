export class SelectionInput {

  constructor (title, options, parent) {
    this.title = title;
    this.options = options;
    this.parent = parent;
    this.domElement = null;
    this.onInput = null;
    this.initDom();
    this.render();
    this.registerListeners();
  }

  initDom () {
    this.domElement = document.createElement('label');
    const span = document.createElement('span');
    span.innerText = this.title;
    const select = document.createElement('select');
    this.domElement.append(span, select);
    this.parent.append(this.domElement);
    select.appendChild(option(null, 'None'));
  }

  registerListeners () {
    const input = this.domElement.getElementsByTagName('select')[0];
    input.addEventListener('input', this.onInputHandler.bind(this));
  }

  onInputHandler (e) {
    const value = e.target.value;
    if (typeof this.onInput === "function") {
      this.onInput(value);
    }
  }

  render () {
    const select = this.domElement.getElementsByTagName('select')[0];
    for (let o of this.options) {
      if (!document.getElementById(o.id)) {
        select.appendChild(option(o.id, o.name))
      }
    }
  }

}

function option (id, name) {
  const option = document.createElement('option');
  option.id = id;
  option.value = id;
  option.innerText = name;
  return option;
}
